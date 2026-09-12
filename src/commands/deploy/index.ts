import { Command } from 'commander'
import { settingsAction } from './settings.js'
import { schemasAction } from './schemas.js'
import { foldersAction } from './folders.js'

import type { DeployCommandOptions } from './types.js'
import { dashboardsAction } from './dashboards.js'
import { flowsAction } from './flows.js'
import { policiesAction } from './policies.js'


export function createDeployCommand(params: DeployCommandOptions): Command {
  return new Command('deploy')
    .description('Permite desplegar data almacenada localmente al entorno de Directus')
    .option('--skip-confirm, -y', 'Omite la confirmación', false)
    .addCommand(createSettingsCommand(params))
    .addCommand(createSchemasCommand(params))
    .addCommand(createFoldersCommand(params))
    .addCommand(createDashboardsCommand(params))
    .addCommand(createFlowsCommand(params))
    .addCommand(createPoliciesCommand(params))
}


function createSettingsCommand(params: DeployCommandOptions): Command {
  return new Command('settings')
    .description('Despliega las Settings almacenadas localmente al entorno de Directus')
    .action(async (_, command: Command) => { await settingsAction(params, command.optsWithGlobals()) })
}


function createSchemasCommand(params: DeployCommandOptions): Command {
  return new Command('schemas')
    .description('Despliega los Schemas almacenados localmente al entorno de Directus')
    .action(async (_, command: Command) => { await schemasAction(params, command.optsWithGlobals()) })
}


function createFoldersCommand(params: DeployCommandOptions): Command {
  return new Command('folders')
    .description('Despliega los Folders almacenados localmente al entorno de Directus')
    .action(async (_, command: Command) => { await foldersAction(params, command.optsWithGlobals()) })
}


function createDashboardsCommand(params: DeployCommandOptions): Command {
  return new Command('dashboards')
    .description('Despliega los Dashboards almacenados localmente al entorno de Directus')
    .action(async (_, command: Command) => { await dashboardsAction(params, command.optsWithGlobals()) })
}


function createFlowsCommand(params: DeployCommandOptions): Command {
  return new Command('flows')
    .description('Despliega los Flows almacenados localmente al entorno de Directus')
    .action(async (_, command: Command) => { await flowsAction(params, command.optsWithGlobals()) })
}


function createPoliciesCommand(params: DeployCommandOptions): Command {
  return new Command('policies')
    .description('Despliega las Policies almacenadas localmente al entorno de Directus')
    .action(async (_, command: Command) => { await policiesAction(params, command.optsWithGlobals()) })
}
