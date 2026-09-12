/* eslint-disable no-console */
import chalk from 'chalk'
import ora from 'ora'
import { DirectusRetrieve } from '@services'
import type { DeployRetrieveCommandOptions } from '@commands'


export async function dashboardsAction(params: DeployRetrieveCommandOptions): Promise<void> {
  const { logger, env, directusApi } = params

  const spinner = ora('Recuperando Dashboards...').start()
  const result = await DirectusRetrieve.dashboards(env, directusApi)
  spinner.succeed()

  console.log()
  result.forEach((item) => {
    console.log(`- ${chalk.blueBright(item.name)}`)
    item.panels.forEach((item2) => {
      console.log(`    + ${chalk.green(item2.name)}`)
    })
    console.log()
  })

  logger.log('SUCCESS', `Se han recuperado ${result.length} Dashboards de Directus con éxito`)
}
