import type { DirectusApi } from '@services'
import type { CommandOptions } from '../types.js'
import type { EnvConfig } from '@env'


export interface RetrieveCommandOptions extends CommandOptions {
  directusApi: DirectusApi
  env: EnvConfig
}
