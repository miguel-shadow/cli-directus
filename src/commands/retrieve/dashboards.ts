/* eslint-disable no-console */
import inquirer from 'inquirer'
import { OutputTools } from '@tools'
import type { RetrieveCommandOptions } from './types.js'
import { DirectusRetrieve } from '@services'
import ora from 'ora'
import type { ConfirmActionOptions } from '../types.js'
import chalk from 'chalk'


export async function dashboardsAction(params: RetrieveCommandOptions, options: ConfirmActionOptions): Promise<void> {
  console.log(OutputTools.formatTitle('Directus CLI - Retrieve Dashboards'))
  console.log()

  const { logger, env, directusApi } = params

  if (!options.skipConfirm) {
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Realizar retrieve de Dashboards?',
        default: false,
      },
    ])

    if (!confirm) {
      return
    }
  }

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
