#!/usr/bin/env node

import { program } from 'commander'
import path from 'node:path'
import { ZodError } from 'zod'

import {
  createEnvCommand,
  createRetrieveCommand,
  createDeployCommand,
} from '@commands'
import { Env } from '@env'
import { DirectusEnv, DirectusApi } from '@services'
import { LoggerFile, OutputTools, ZodTools } from '@tools'

const env = Env.loadEnv()
const logger = new LoggerFile({ filepath: path.join(env.paths.root, 'logs', 'directus-cli.log') })
const directusEnv = new DirectusEnv(env)
const directusApi = new DirectusApi(directusEnv)

program
  .name('directus')
  .description('Command Line Interface para Directus')
  .version('1.0.0', '-v, --version', 'Muestra el número de versión')

program.addCommand(createEnvCommand({ logger, directusEnv, directusApi }))
program.addCommand(createRetrieveCommand({ logger, env, directusApi }))
program.addCommand(createDeployCommand({
  logger,
  env,
  directusEnv,
  directusApi,
}))

try {
  await program.parseAsync()
} catch (error) {
  let message

  if (error instanceof ZodError) {
    const zodErrors = ZodTools.getErrorMessages(error)

    if (zodErrors.length === 1) {
      message = zodErrors[0]
    } else {
      message = `\n${OutputTools.formatList(zodErrors, {
        indentSize: 4,
      })}`
    }
  } else if (error instanceof Error) {
    message = error.message
  } else {
    message = JSON.stringify(error)
  }

  logger.log('ERROR', `Se ha producido el siguiente error: ${message}`)
  process.exit(1)
}
