/* eslint-disable no-console */
import inquirer from 'inquirer'
import { OutputTools } from '@tools'
import type { DeployCommandOptions } from './types.js'
import { DirectusDeploy } from '@services'
import ora from 'ora'
import type { ConfirmActionOptions } from '../types.js'


export async function settingsAction(params: DeployCommandOptions, options: ConfirmActionOptions): Promise<void> {
  console.log(OutputTools.formatTitle('Directus CLI - Deploy Settings'))
  console.log()

  const {
    logger,
    env,
    directusEnv,
    directusApi,
  } = params

  if (!options.skipConfirm) {
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: '¿Desplegar las Settings?',
        default: false,
      },
    ])

    if (!confirm) {
      return
    }
  }

  const spinner = ora('Desplegando Settings...').start()
  await DirectusDeploy.settings(env, directusEnv, directusApi)
  spinner.succeed()

  console.log()
  logger.log('SUCCESS', 'Se han desplegado las Settings en Directus con éxito')
}
