/* eslint-disable no-console */
import chalk from 'chalk'
import ora from 'ora'
import { OutputTools, type Logger } from '@tools'
import { DirectusDeploy, type SchemaDeployResume } from '@services'
import type { DeployRetrieveCommandOptions } from '@commands'


export async function schemasAction(params: DeployRetrieveCommandOptions): Promise<void> {
  const { logger, env, directusApi } = params

  const spinner = ora('Desplegando Schemas...').start()
  const result = await DirectusDeploy.schemas(env, directusApi)
  spinner.succeed()

  showResume(logger, result)
}


function showResume(logger: Logger, result: SchemaDeployResume): void {
  const message: string[] = []

  const schemaUpdated = result.schemaResume.collections.length > 0 ||
    result.schemaResume.fields.length > 0 ||
    result.schemaResume.relations.length > 0

  if (schemaUpdated) {
    const schemaMessage: string[] = []
    if (result.schemaResume.collections.length > 0) {
      schemaMessage.push(`Collections:\n${chalk.green(OutputTools.formatList(result.schemaResume.collections.map((c) => c.collection), { listChar: '+', indentSize: 8 }))}\n`)
    }
    if (result.schemaResume.fields.length > 0) {
      schemaMessage.push(`Fields:\n${chalk.green(OutputTools.formatList(result.schemaResume.fields.map((c) => `${c.collection}.${c.field}`), { listChar: '+', indentSize: 8 }))}\n`)
    }
    if (result.schemaResume.relations.length > 0) {
      schemaMessage.push(`Relations:\n${chalk.green(OutputTools.formatList(result.schemaResume.relations.map((c) => `${c.collection}.${c.field}__${c.related_collection}`), { listChar: '+', indentSize: 8 }))}\n`)
    }

    message.push(`${chalk.blue('Schema con modificaciones')}\n${OutputTools.formatList(schemaMessage, { indentSize: 4 })}`)
  } else {
    message.push(chalk.blue('Schema sin modificaciones\n'))
  }

  const bookmarkMessage: string[] = []

  if (result.bookmarksResume.new.length > 0) {
    bookmarkMessage.push(`Creados\n${OutputTools.formatList(result.bookmarksResume.new.map((b) => `${chalk.green(b.collection)} ${b.bookmark ?? 'Default'}`), {
      indentSize: 8, listChar: '+', listCharColor: chalk.green,
    })}\n`)
  }

  if (result.bookmarksResume.existing.length > 0) {
    bookmarkMessage.push(`Actualizados\n${OutputTools.formatList(result.bookmarksResume.existing.map((b) => `${chalk.yellow(b.collection)} ${b.bookmark ?? 'Default'}`), {
      indentSize: 8, listChar: '-', listCharColor: chalk.yellow,
    })}\n`)
  }

  message.push(`${chalk.blue('Bookmarks')}\n${OutputTools.formatList(bookmarkMessage, { indentSize: 4 })}`)

  console.log()
  console.log(OutputTools.formatList(message, { listCharColor: chalk.blue }))
  logger.log('SUCCESS', 'Se han desplegado los Schemas en Directus con éxito')
}
