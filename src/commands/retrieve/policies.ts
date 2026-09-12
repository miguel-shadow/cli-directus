/* eslint-disable no-console */
import inquirer from 'inquirer'
import { OutputTools } from '@tools'
import type { RetrieveCommandOptions } from './types.js'
import { DirectusRetrieve } from '@services'
import ora from 'ora'
import type { ConfirmActionOptions } from '../types.js'
import chalk from 'chalk'


export async function policiesAction(params: RetrieveCommandOptions, options: ConfirmActionOptions): Promise<void> {
  console.log(OutputTools.formatTitle('Directus CLI - Retrieve Policies'))
  console.log()

  const { logger, env, directusApi } = params

  if (!options.skipConfirm) {
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Realizar retrieve de Policies?',
        default: false,
      },
    ])

    if (!confirm) {
      return
    }
  }

  const spinner = ora('Recuperando Policies...').start()
  const policies = await DirectusRetrieve.policies(env, directusApi)
  spinner.succeed()

  console.log()
  policies.forEach((policy) => {
    console.log(`- ${chalk.blueBright(policy.name)}`)
    policy.permissions.forEach((permission) => {
      console.log(`    + ${chalk.green(permission.collection)} ${chalk.green(permission.action)}`)
    })
    console.log()
  })

  logger.log('SUCCESS', `Se han recuperado ${policies.length} Policies de Directus con éxito`)
}
