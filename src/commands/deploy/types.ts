import type { DirectusApi, DirectusEnv } from '@services'
import type { CommandOptions } from '../types.js'
import type { EnvConfig } from '@env'


export interface DeployCommandOptions extends CommandOptions {
  directusApi: DirectusApi
  directusEnv: DirectusEnv
  env: EnvConfig
}
