import { Command } from 'commander'
import type { DeployCommandOptions } from './types.js'
import { settingsAction } from './settings.js'


export function createDeployCommand(params: DeployCommandOptions): Command {
  return new Command('deploy')
    .description('Permite desplegar data almacenada localmente al entorno de Directus')
    .option('--skip-confirm, -y', 'Omite la confirmación', false)
    .addCommand(createSettingsCommand(params))
}


function createSettingsCommand(params: DeployCommandOptions): Command {
  return new Command('settings')
    .description('Despliega las Settings almacenadas localmente al entorno de Directus')
    .action(async (_, command: Command) => { await settingsAction(params, command.optsWithGlobals()) })
}
