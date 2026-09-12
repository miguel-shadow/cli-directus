/* eslint-disable no-console */
import chalk from 'chalk'
import ora from 'ora'
import { DirectusRetrieve } from '@services'
import type { DeployRetrieveCommandOptions } from '@commands'


export async function flowsAction(params: DeployRetrieveCommandOptions): Promise<void> {
  const { logger, env, directusApi } = params

  const spinner = ora('Recuperando Flows...').start()
  const flows = await DirectusRetrieve.flows(env, directusApi)
  spinner.succeed()

  console.log()
  flows.forEach((flow) => {
    console.log(`- ${chalk.blueBright(flow.name)}`)
    flow.operations.forEach((operation) => {
      console.log(`    + ${chalk.green(operation.name)}`)
    })
    console.log()
  })

  logger.log('SUCCESS', `Se han recuperado ${flows.length} Flows de Directus con éxito`)
}
