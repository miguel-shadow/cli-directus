import type { Logger } from '@tools'


export interface CommandOptions {
  logger: Logger
}


export interface ConfirmActionOptions {
  skipConfirm: boolean
}
