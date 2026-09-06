/* eslint-disable no-console */
import inquirer from 'inquirer'
import { OutputTools } from '@tools'
import type { EnvCommandOptions, EnvSetActionOptions } from './types.js'


export async function setAction(params: EnvCommandOptions, alias: string, options: EnvSetActionOptions): Promise<void> {
  console.log(OutputTools.formatTitle('Directus CLI - Establecer entorno'))
  console.log()

  const { logger, directusEnv } = params

  if (!options.skipConfirm) {
    const { ok } = await inquirer.prompt<{ ok: boolean }>([
      {
        type: 'confirm',
        name: 'ok',
        message: `¿Establecer el entorno '${alias}' como activo?`,
        default: false,
      },
    ])

    if (!ok) {
      return
    }

    console.log()
  }

  directusEnv.setCurrent(alias)
  logger.log('SUCCESS', `Entorno '${alias}' establecido como activo.`)
}
