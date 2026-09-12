/* eslint-disable no-console */
import chalk from 'chalk'
import ora from 'ora'
import { DirectusRetrieve, type GroupsMap } from '@services'
import { OutputTools, type Logger } from '@tools'
import type { DeployRetrieveCommandOptions } from '@commands'


export async function schemasAction(params: DeployRetrieveCommandOptions): Promise<void> {
  const { logger, env, directusApi } = params

  const spinner = ora('Recuperando Schemas...').start()
  const result = await DirectusRetrieve.schemas(env, directusApi)
  spinner.succeed()

  console.log()
  showResume(logger, result)
}


function showResume(logger: Logger, result: GroupsMap): void {
  let total = 0
  const messages: string[] = []

  for (const [group, schemas] of result) {
    const schemaResume = []

    for (const [_, schema] of schemas) {
      schemaResume.push(`${chalk.blueBright(schema.collection)}\n${OutputTools.formatList([
        `Bookmarks: ${chalk.green(schema.bookmarks.length)}`,
        `Fields: ${chalk.green(schema.fields.length)}`,
        `Relations: ${chalk.green(schema.relations.length)}\n`,
      ], {
        indentSize: 8,
      })}`)
    }

    messages.push(`${chalk.blue(group)}: ${chalk.green(schemas.size)}\n${OutputTools.formatList(schemaResume, {
      indentSize: 4,
      showIndex: true,
      listChar: '.',
      listCharColor: chalk.blueBright,
    })}`)

    total += schemas.size
  }

  console.log(OutputTools.formatList(messages, { listCharColor: chalk.blue }))
  logger.log('SUCCESS', `Se han recuperado ${total} Schemas de Directus con éxito`)
}
