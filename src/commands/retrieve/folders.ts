/* eslint-disable no-console */
import chalk from 'chalk'
import ora from 'ora'
import { DirectusRetrieve } from '@services'
import type { DeployRetrieveCommandOptions } from '@commands'


export async function foldersAction(params: DeployRetrieveCommandOptions): Promise<void> {
  const { logger, env, directusApi } = params

  const spinner = ora('Recuperando Folders...').start()
  const folders = await DirectusRetrieve.folders(env, directusApi)
  spinner.succeed()

  console.log()
  let lastDepth = 0
  folders.forEach((folder) => {
    const depth = folder.path.split(/[\\/]/).length - 1

    if (depth === 0 && depth < lastDepth) {
      console.log()
    }

    const chalkInstance = depth % 2 === 0 ? chalk.blue : chalk.blueBright
    console.log(`${'  '.repeat(depth)}${chalk.green('+')} ${chalkInstance(folder.name)}`)

    lastDepth = depth
  })

  console.log()
  logger.log('SUCCESS', `Se han recuperado ${folders.length} Folders de Directus con éxito`)
}
