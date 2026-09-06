import type { DirectusEnv } from '@services'
import type { CommandOptions } from '../types.js'


export interface EnvCommandOptions extends CommandOptions {
  directusEnv: DirectusEnv
}


export interface EnvListActionOptions {
  showSecrets: boolean
}

export interface EnvRemoveActionOptions {
  skipConfirm: boolean
}

export interface EnvSetActionOptions {
  skipConfirm: boolean
}
