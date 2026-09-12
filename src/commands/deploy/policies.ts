/* eslint-disable no-console */
import chalk from 'chalk'
import ora from 'ora'
import { OutputTools, type Logger } from '@tools'
import { DirectusDeploy, type PoliciesResume } from '@services'
import type { DeployRetrieveCommandOptions } from '@commands'


export async function policiesAction(params: DeployRetrieveCommandOptions): Promise<void> {
  const { logger, env, directusApi } = params

  const spinner = ora('Desplegando Policies...').start()
  const result = await DirectusDeploy.policies(env, directusApi)
  spinner.succeed()

  showResume(logger, result)
}


function showResume(logger: Logger, result: PoliciesResume): void {
  const message: string[] = []

  if (result.new.length > 0) {
    message.push(`Creadas\n${OutputTools.formatList(result.new.map((item) => chalk.green(item.name)), {
      indentSize: 4, listChar: '+', listCharColor: chalk.green,
    })}\n`)
  }

  if (result.existing.length > 0) {
    message.push(`Actualizadas\n${OutputTools.formatList(result.existing.map((item) => chalk.yellow(item.name)), {
      indentSize: 4, listChar: '-', listCharColor: chalk.yellow,
    })}\n`)
  }


  console.log()
  console.log(OutputTools.formatList(message))
  logger.log('SUCCESS', 'Se han desplegado las Policies en Directus con éxito')
}
