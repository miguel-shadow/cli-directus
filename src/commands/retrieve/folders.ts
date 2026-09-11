/* eslint-disable no-console */
import inquirer from 'inquirer'
import { OutputTools } from '@tools'
import type { RetrieveCommandOptions } from './types.js'
import { DirectusRetrieve } from '@services'
import ora from 'ora'
import type { ConfirmActionOptions } from '../types.js'
import chalk from 'chalk'


export async function foldersAction(params: RetrieveCommandOptions, options: ConfirmActionOptions): Promise<void> {
  console.log(OutputTools.formatTitle('Directus CLI - Retrieve Folders'))
  console.log()

  const { logger, env, directusApi } = params

  if (!options.skipConfirm) {
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Realizar retrieve de Folders?',
        default: false,
      },
    ])

    if (!confirm) {
      return
    }
  }

  const spinner = ora('Recuperando Folders...').start()
  const folders = await DirectusRetrieve.folders(env, directusApi)
  spinner.succeed()

  console.log()
  let lastDepth = 0
  folders.forEach((folder) => {
    const depth = folder.path.split(/[\\/]/).length - 1

    if (depth === 0 && depth < lastDepth) {
      console.log()
    }

    const chalkInstance = depth % 2 === 0 ? chalk.blue : chalk.blueBright
    console.log(`${'  '.repeat(depth)}${chalk.green('+')} ${chalkInstance(folder.name)}`)

    lastDepth = depth
  })

  console.log()
  logger.log('SUCCESS', `Se han recuperado ${folders.length} Folders de Directus con éxito`)
}
