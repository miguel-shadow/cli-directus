import { FileSystemTools } from '../file-system/file-system.js'
import { Logger } from './logger.js'
import type { LoggerFileOptions, LogLevel } from './types.js'


/**
 * Permite registrar logs tanto en terminal como en un archivo, especificando el nivel mínimo a almacenar.
 *
 * Niveles de log (ordenados de menor a mayor):
 * - `INFO`: Para información general sobre el funcionamiento de la aplicación.
 * - `SUCCESS`: Para indicar operaciones exitosas.
 * - `WARN`: Para advertencias que no detienen la ejecución pero podrían indicar problemas.
 * - `ERROR`: Para errores que requieren atención inmediata.
 *
 * @param options Opciones de Logger
 *
 * `filepath` *{string}* - Ruta del archivo donde se almacenarán los logs. Si no se especifica no se almacenará en ningún archivo. Defaults `''`
 *
 * `minLogLevel` *{LogLevel}* - Nivel mínimo de log a registrar. Defaults `Logger.DEFAULT_MIN_LOG_LEVEL`.
 */
export class LoggerFile extends Logger {
  private filepath: string


  constructor(options: LoggerFileOptions = {}) {
    super()
    this.filepath = options.filepath?.trim() ?? ''
    this.minLogLevel = options.minLogLevel ?? Logger.DEFAULT_MIN_LOG_LEVEL
  }


  /**
   * Convierte una data en una línea de log para almacenar.
   *
   * @param level Nivel de log.
   * @param data Data a convertir.
   *
   * @returns Línea convertida en formato `[0000-00-00T00:00:00.000Z] [LOG_LEVEL] Data`.
   */
  private formatLogLine(level: LogLevel, data: unknown): string {
    const timestamp = new Date().toISOString()
    const msg = this.dataToString(data)
      .replaceAll('\n', '\\n')
      .trim()

    return `[${timestamp}] [${level}] ${msg}\n`
  }


  /**
   * Almacena el log en el archivo teniendo en cuenta el `LogLevel`.
   *
   * @param level Nivel de log.
   * @param data Data.
   */
  private saveToFile(level: LogLevel, data: unknown): void {
    if (this.filepath.length === 0 || !this.shouldSaveLog(level)) {
      return
    }

    const line = this.formatLogLine(level, data)

    FileSystemTools.writeFileSync(this.filepath, line, { append: true })
  }


  /**
   * Muestra un log con el nivel proporcionado y se almacena en un archivo según `minLogLevel`.
   *
   * @param logLevel Nivel de log.
   * @param data Datos a mostrar.
   */
  public override log(logLevel: LogLevel, data: unknown): void {
    super.log(logLevel, data)
    this.saveToFile(logLevel, data)
  }
}
