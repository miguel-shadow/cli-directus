import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homedir } from 'node:os'

import type { EnvConfig } from './types.js'


/**
 * Permite cargar las variables de entorno y cargar/guardar las configuraciones personalizables
 */
export const Env = {
  loadEnv,
}


// Rutas
const DIR_PATH = dirname(fileURLToPath(import.meta.url))


/**
 * Carga las **variables de entorno** almacenadas en un archivo `.env` o en variables de sistema y las configuraciones personalizadas
 */
function loadEnv(): EnvConfig {
  return {
    paths: {
      root: resolve(DIR_PATH, '..', '..'),
      user: resolve(homedir(), '.directus-cli'),
      cwd: process.cwd(),
      src: join(process.cwd(), 'src'),
    },
  }
}
