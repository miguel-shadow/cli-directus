import type { ChalkInstance } from 'chalk'

export interface GetErrorMessagesOptions {
  includePath?: boolean
  includeUnrecognizedKeys?: boolean
  pathColor?: ChalkInstance | null
  textColor?: ChalkInstance | null
}
