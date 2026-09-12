/* eslint-disable @stylistic/function-paren-newline */
/* eslint-disable @stylistic/max-len */
import chalk from 'chalk'
import { Command } from 'commander'
import { dashboardsAction } from './dashboards.js'
import { flowsAction } from './flows.js'
import { foldersAction } from './folders.js'
import { policiesAction } from './policies.js'
import { schemasAction } from './schemas.js'
import { settingsAction } from './settings.js'
import { commandTools, type DeployRetrieveCommandOptions, type DeployRetrieveResourceActionSet } from '@commands'
import { RESOURCES } from '../tools/resources.js'


const retrieveActions: DeployRetrieveResourceActionSet = {
  title: 'Retrieve',
  confirmVerb: 'Recuperar',
  actions: {
    settings: settingsAction,
    schemas: schemasAction,
    flows: flowsAction,
    folders: foldersAction,
    dashboards: dashboardsAction,
    policies: policiesAction,
  },
}


export function createRetrieveCommand(params: DeployRetrieveCommandOptions): Command {
  return new Command('retrieve')
    .description('Permite recuperar los recursos del entorno de Directus y almacenarla en la carpeta actual. Si no se especifica ningún parámetro --rosource (-r), se recuperan todos los recursos')
    .option('--skip-confirm, -y', 'Omite la confirmación', false)
    .option(
      '-r, --resource <resource>',
      `Recurso/s a recuperar (${RESOURCES.map((r) => chalk.underline(r)).join(', ')}). Por ejemplo '--resource settings --resource schemas'`,
      commandTools.dispatcher.collectDeployRetrieveResource,
    )
    .action(async (_, command: Command) => {
      await commandTools.dispatcher.runDeployRetrieveResources(params, command.optsWithGlobals(), retrieveActions)
    })
}
