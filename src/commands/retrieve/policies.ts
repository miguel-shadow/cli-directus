/* eslint-disable no-console */
import chalk from 'chalk'
import ora from 'ora'
import { DirectusRetrieve } from '@services'
import type { DeployRetrieveCommandOptions } from '@commands'


export async function policiesAction(params: DeployRetrieveCommandOptions): Promise<void> {
  const { logger, env, directusApi } = params

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
