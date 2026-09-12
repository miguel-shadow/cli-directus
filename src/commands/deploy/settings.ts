/* eslint-disable no-console */
import ora from 'ora'
import { DirectusDeploy } from '@services'
import type { DeployRetrieveCommandOptions } from '@commands'


export async function settingsAction(params: DeployRetrieveCommandOptions): Promise<void> {
  const { logger, env, directusApi } = params

  const spinner = ora('Desplegando Settings...').start()
  await DirectusDeploy.settings(env, directusApi)
  spinner.succeed()

  console.log()
  logger.log('SUCCESS', 'Se han desplegado las Settings en Directus con éxito')
}
