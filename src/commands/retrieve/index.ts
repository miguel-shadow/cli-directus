import { Command } from 'commander'
import { settingsAction } from './settings.js'
import { schemasAction } from './schemas.js'
import { foldersAction } from './folders.js'

import type { RetrieveCommandOptions } from './types.js'


export function createRetrieveCommand(params: RetrieveCommandOptions): Command {
  return new Command('retrieve')
    .description('Permite recuperar data del entorno de Directus y almacenarla en la carpeta actual')
    .option('--skip-confirm, -y', 'Omite la confirmación', false)
    .addCommand(createSettingsCommand(params))
    .addCommand(createSchemasCommand(params))
    .addCommand(createFoldersCommand(params))
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
