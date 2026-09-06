/* eslint-disable no-console */
import inquirer from 'inquirer'
import { OutputTools } from '@tools'
import type { EnvCommandOptions, EnvRemoveActionOptions } from './types.js'


export async function removeAction(params: EnvCommandOptions, alias: string, options: EnvRemoveActionOptions): Promise<void> {
  console.log(OutputTools.formatTitle('Directus CLI - Eliminar entorno'))
  console.log()

  const { logger, directusEnv } = params

  if (!options.skipConfirm) {
    const { ok } = await inquirer.prompt<{ ok: boolean }>([
      {
        type: 'confirm',
        name: 'ok',
        message: `¿Eliminar el entorno '${alias}'?`,
        default: false,
      },
    ])

    if (!ok) {
      return
    }
  }

  directusEnv.remove(alias)
  logger.log('SUCCESS', `Entorno '${alias}' eliminado.`)
}
