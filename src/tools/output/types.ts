import type { ChalkInstance } from 'chalk'


export interface DivisorOptions {
  char?: string
  color?: ChalkInstance | null
  length?: number
}

export interface FormatListOptions {
  indentSize?: number
  listChar?: string
  listCharColor?: ChalkInstance | null
  showIndex?: boolean
  textColor?: ChalkInstance | null
}

export type FormatSubtitleOptions = FormatTitleOptions

export interface FormatTitleOptions {
  divisorChar?: string
  divisorColor?: ChalkInstance | null
  divisorLength?: number
  textColor?: ChalkInstance | null
}
