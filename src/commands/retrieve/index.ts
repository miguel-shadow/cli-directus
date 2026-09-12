import { Command } from 'commander'
import { settingsAction } from './settings.js'
import { schemasAction } from './schemas.js'
import { foldersAction } from './folders.js'
import { dashboardsAction } from './dashboards.js'
import { flowsAction } from './flows.js'
import { policiesAction } from './policies.js'

import type { RetrieveCommandOptions } from './types.js'


export function createRetrieveCommand(params: RetrieveCommandOptions): Command {
  return new Command('retrieve')
    .description('Permite recuperar data del entorno de Directus y almacenarla en la carpeta actual')
    .option('--skip-confirm, -y', 'Omite la confirmación', false)
    .addCommand(createSettingsCommand(params))
    .addCommand(createSchemasCommand(params))
    .addCommand(createFoldersCommand(params))
    .addCommand(createDashboardsCommand(params))
    .addCommand(createFlowsCommand(params))
    .addCommand(createPoliciesCommand(params))
}


function createSettingsCommand(params: RetrieveCommandOptions): Command {
  return new Command('settings')
    .description('Recupera las Settings del entorno de Directus')
    .action(async (_, command: Command) => { await settingsAction(params, command.optsWithGlobals()) })
}


function createSchemasCommand(params: RetrieveCommandOptions): Command {
  return new Command('schemas')
    .description('Recupera los Schemas del entorno de Directus')
    .action(async (_, command: Command) => { await schemasAction(params, command.optsWithGlobals()) })
}


function createFoldersCommand(params: RetrieveCommandOptions): Command {
  return new Command('folders')
    .description('Recupera los Folders del entorno de Directus')
    .action(async (_, command: Command) => { await foldersAction(params, command.optsWithGlobals()) })
}


function createDashboardsCommand(params: RetrieveCommandOptions): Command {
  return new Command('dashboards')
    .description('Recupera los Dashboards del entorno de Directus')
    .action(async (_, command: Command) => { await dashboardsAction(params, command.optsWithGlobals()) })
}


function createFlowsCommand(params: RetrieveCommandOptions): Command {
  return new Command('flows')
    .description('Recupera los Flows del entorno de Directus')
    .action(async (_, command: Command) => { await flowsAction(params, command.optsWithGlobals()) })
}


function createPoliciesCommand(params: RetrieveCommandOptions): Command {
  return new Command('policies')
    .description('Recupera las Policies del entorno de Directus')
    .action(async (_, command: Command) => { await policiesAction(params, command.optsWithGlobals()) })
}
