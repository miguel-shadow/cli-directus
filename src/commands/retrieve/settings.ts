/* eslint-disable no-console */
import inquirer from 'inquirer'
import { OutputTools } from '@tools'
import type { RetrieveCommandOptions } from './types.js'
import { DirectusRetrieve } from '@services'
import ora from 'ora'
import type { ConfirmActionOptions } from '../types.js'


export async function settingsAction(params: RetrieveCommandOptions, options: ConfirmActionOptions): Promise<void> {
  console.log(OutputTools.formatTitle('Directus CLI - Retrieve Settings'))
  console.log()

  const { logger, env, directusApi } = params

  if (!options.skipConfirm) {
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Realizar retrieve de Settings?',
        default: false,
      },
    ])

    if (!confirm) {
      return
    }
  }

  const spinner = ora('Recuperando Settings...').start()
  await DirectusRetrieve.settings(env, directusApi)
  spinner.succeed()

  console.log()
  logger.log('SUCCESS', 'Se han recuperado las Settings de Directus con éxito')
}
