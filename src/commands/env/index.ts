import { Command } from 'commander'
import { addAction } from './add.js'
import { listAction } from './list.js'
import { removeAction } from './remove.js'
import { setAction } from './set.js'

import type {
  EnvCommandOptions,
  EnvListActionOptions,
  EnvRemoveActionOptions,
  EnvSetActionOptions,
} from './types.js'


export function createEnvCommand(params: EnvCommandOptions): Command {
  return new Command('env')
    .description('Gestiona los entornos de Directus')
    .addCommand(createAddCommand(params))
    .addCommand(createListCommand(params))
    .addCommand(createRemoveCommand(params))
    .addCommand(createSetCommand(params))
}


function createAddCommand(params: EnvCommandOptions): Command {
  return new Command('add')
    .description('Añade un nuevo entorno de Directus')
    .action(async () => { await addAction(params) })
}

function createListCommand(params: EnvCommandOptions): Command {
  return new Command('list')
    .description('Lista los entornos disponibles de Directus')
    .option('--show-secrets, -s', 'Muestra los secretos sin ocultar', false)
    .action((options: EnvListActionOptions) => { listAction(params, options) })
}

function createRemoveCommand(params: EnvCommandOptions): Command {
  return new Command('remove')
    .description('Elimina un entorno de Directus')
    .argument('<alias>', 'Alias del entorno')
    .option('--skip-confirm, -y', 'Omite la confirmación', false)
    .action(async (alias: string, options: EnvRemoveActionOptions) => { await removeAction(params, alias, options) })
}

function createSetCommand(params: EnvCommandOptions): Command {
  return new Command('set')
    .description('Establece el entorno activo de Directus')
    .argument('<alias>', 'Alias del entorno')
    .option('--skip-confirm, -y', 'Omite la confirmación', false)
    .action(async (alias: string, options: EnvSetActionOptions) => { await setAction(params, alias, options) })
}
