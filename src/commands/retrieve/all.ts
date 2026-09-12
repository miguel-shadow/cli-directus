/* eslint-disable no-console */
import inquirer from 'inquirer'
import { OutputTools, TimeTools } from '@tools'
import type { ConfirmActionOptions } from '../types.js'
import { dashboardsAction } from './dashboards.js'
import { flowsAction } from './flows.js'
import { foldersAction } from './folders.js'
import { policiesAction } from './policies.js'
import { schemasAction } from './schemas.js'
import { settingsAction } from './settings.js'
import type { RetrieveCommandOptions } from './types.js'


export async function allAction(params: RetrieveCommandOptions, options: ConfirmActionOptions): Promise<void> {
  console.log(OutputTools.formatTitle('Directus CLI - Retrieve All'))
  console.log()

  if (!options.skipConfirm) {
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: '¿Recuperar todos los recursos?',
        default: false,
      },
    ])

    if (!confirm) {
      return
    }
  }

  const skipConfirmOptions = { ...options, skipConfirm: true }

  await settingsAction(params, skipConfirmOptions)
  await TimeTools.sleep(1000)
  console.log()

  await schemasAction(params, skipConfirmOptions)
  await TimeTools.sleep(1000)
  console.log()

  await flowsAction(params, skipConfirmOptions)
  await TimeTools.sleep(1000)
  console.log()

  await foldersAction(params, skipConfirmOptions)
  await TimeTools.sleep(1000)
  console.log()

  await dashboardsAction(params, skipConfirmOptions)
  await TimeTools.sleep(1000)
  console.log()

  await policiesAction(params, skipConfirmOptions)
}
