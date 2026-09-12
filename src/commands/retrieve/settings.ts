/* eslint-disable no-console */
import ora from 'ora'
import { DirectusRetrieve } from '@services'
import type { DeployRetrieveCommandOptions } from '@commands'


export async function settingsAction(params: DeployRetrieveCommandOptions): Promise<void> {
  const { logger, env, directusApi } = params

  const spinner = ora('Recuperando Settings...').start()
  await DirectusRetrieve.settings(env, directusApi)
  spinner.succeed()

  console.log()
  logger.log('SUCCESS', 'Se han recuperado las Settings de Directus con éxito')
}
