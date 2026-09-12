/* eslint-disable no-console */
import inquirer from 'inquirer'
import { OutputTools } from '@tools'
import type { RetrieveCommandOptions } from './types.js'
import { DirectusRetrieve } from '@services'
import ora from 'ora'
import type { ConfirmActionOptions } from '../types.js'
import chalk from 'chalk'


export async function flowsAction(params: RetrieveCommandOptions, options: ConfirmActionOptions): Promise<void> {
  console.log(OutputTools.formatTitle('Directus CLI - Retrieve Flows'))
  console.log()

  const { logger, env, directusApi } = params

  if (!options.skipConfirm) {
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Realizar retrieve de Flows?',
        default: false,
      },
    ])

    if (!confirm) {
      return
    }
  }

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
