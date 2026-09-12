import type { EnvConfig } from '@env'
import type { DirectusApi } from '@services'
import type { Logger } from '@tools'
import type { Resource } from './tools/resources.js'


export interface CommandOptions {
  logger: Logger
}


export interface DeployRetrieveCommandOptions extends CommandOptions {
  directusApi: DirectusApi
  env: EnvConfig
}

export interface DeployRetrieveResourceActionOptions {
  skipConfirm: boolean
  env?: string
  resource?: string[]
}

export interface DeployRetrieveResourceActionSet {
  actions: Record<Resource, (config: DeployRetrieveCommandOptions, options: DeployRetrieveResourceActionOptions) => Promise<void>>
  confirmVerb: string
  title: string
}
