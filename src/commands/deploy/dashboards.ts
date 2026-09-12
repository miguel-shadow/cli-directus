/* eslint-disable no-console */
import chalk from 'chalk'
import ora from 'ora'
import { OutputTools, type Logger } from '@tools'
import { DirectusDeploy, type DashboardsResume } from '@services'
import type { DeployRetrieveCommandOptions } from '@commands'


export async function dashboardsAction(params: DeployRetrieveCommandOptions): Promise<void> {
  const { logger, env, directusApi } = params

  const spinner = ora('Desplegando Dashboards...').start()
  const result = await DirectusDeploy.dashboards(env, directusApi)
  spinner.succeed()

  showResume(logger, result)
}


function showResume(logger: Logger, result: DashboardsResume): void {
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
