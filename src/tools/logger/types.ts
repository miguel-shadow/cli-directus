export interface LoggerFileOptions {
  filepath?: string
  minLogLevel?: LogLevel
}

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'SUCCESS'
