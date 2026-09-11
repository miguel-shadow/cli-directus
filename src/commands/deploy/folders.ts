/* eslint-disable no-console */
import chalk from 'chalk'
import inquirer from 'inquirer'
import ora from 'ora'
import { OutputTools, type Logger } from '@tools'
import { DirectusDeploy, type FoldersResume } from '@services'
import type { ConfirmActionOptions } from '@commands'
import type { DeployCommandOptions } from './types.js'


export async function foldersAction(params: DeployCommandOptions, options: ConfirmActionOptions): Promise<void> {
  console.log(OutputTools.formatTitle('Directus CLI - Deploy Folders'))
  console.log()

  const { logger, env, directusApi } = params

  if (!options.skipConfirm) {
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: '¿Desplegar los Folders?',
        default: false,
      },
    ])

    if (!confirm) {
      return
    }
  }

  const spinner = ora('Desplegando Folders...').start()
  const result = await DirectusDeploy.folders(env, directusApi)
  spinner.succeed()

  showResume(logger, result)
}


function showResume(logger: Logger, result: FoldersResume): void {
  const message: string[] = []

  if (result.new.length > 0) {
    message.push(`Creados\n${OutputTools.formatList(result.new.map((item) => chalk.green(item.name)), {
      indentSize: 4, listChar: '+', listCharColor: chalk.green,
    })}\n`)
  }

  if (result.existing.length > 0) {
    message.push(`Actualizados\n${OutputTools.formatList(result.existing.map((item) => chalk.yellow(item.name)), {
      indentSize: 4, listChar: '-', listCharColor: chalk.yellow,
    })}\n`)
  }


  console.log()
  console.log(OutputTools.formatList(message))
  logger.log('SUCCESS', 'Se han desplegado los Folders en Directus con éxito')
}
