/* eslint-disable no-console */
import chalk from 'chalk'
import type { LogLevel } from './types.js'


/**
 * Permite mostrar logs en terminal.
 */
export class Logger {
  public static readonly DEFAULT_MIN_LOG_LEVEL: LogLevel = 'ERROR'
  public static LOG_LEVELS_ORDER: readonly LogLevel[] = [
    'INFO',
    'SUCCESS',
    'WARN',
    'ERROR',
  ]
  protected minLogLevel: LogLevel = Logger.DEFAULT_MIN_LOG_LEVEL


  /**
   * Muestra un mensaje con formato de `Error`.
   *
   * @param msg Mensaje a mostrar.
   */
  private error(msg: string): void {
    console.error(this.formatErrorMessage(msg))
  }


  /**
   * Retorna un mensaje con formato de `Debug`. Mostrando un título (si se especifica) o una separación básica (*Defaults*).
   *
   * - `---------- ${title} ----------`
   * - `--------------------`
   *
   * @param data Data a mostrar.
   * @param title Título a mostrar.
   *
   * @returns Mensaje formateado.
   */
  private formatDebugMessage(data: unknown, title: string = ''): string {
    const separator = '-'.repeat(10)
    const header = title ? `${separator} ${title} ${separator}` : separator.repeat(2)

    return chalk.blueBright(`${header}\n${this.dataToString(data, true)}`)
  }


  /**
   * Retorna un mensaje con formato de `Error` añadiendo el emoji `❌` para una fácil identificación.
   *
   * @param msg Mensaje a mostrar.
   *
   * @returns Mensaje formateado.
   */
  private formatErrorMessage(msg: string): string {
    return `❌ ${chalk.red(msg)}`
  }


  /**
   * Muestra un mensaje con formato de `Info`.
   *
   * @param msg Mensaje a mostrar.
   */
  private info(msg: string): void {
    console.log(chalk.blue(msg))
  }


  /**
   * Muestra un mensaje con formato de `Success`.
   *
   * @param msg Mensaje a mostrar.
   */
  private success(msg: string): void {
    console.log(chalk.green(msg))
  }


  /**
   * Muestra un mensaje con formato de `Warn`.
   *
   * @param msg Mensaje a mostrar.
   */
  private warn(msg: string): void {
    console.warn(chalk.yellow(msg))
  }


  /**
   * Convierte data desconocida a una cadena de texto.
   *
   * @param data Data a convertir.
   * @param pretty Si se convierte a JSON, mostrar indentación (`true`) o una sola línea (`false`). Defaults `false`.
   *
   * @returns Data convertida.
   */
  protected dataToString(data: unknown, pretty = false): string {
    if (data instanceof Error) {
      return data.message
    }

    if (typeof data === 'object') {
      return pretty ?
        JSON.stringify(data, null, 2) :
        JSON.stringify(data)
    }

    return String(data).trim()
  }


  /**
   * Comprueba si el log se debe almacenar o no.
   *
   * @param level LogLevel a comprobar.
   *
   * @returns `true` si es igual o superior a `minLogLevel`.
   */
  protected shouldSaveLog(level: LogLevel): boolean {
    return Logger.LOG_LEVELS_ORDER.indexOf(level) >= Logger.LOG_LEVELS_ORDER.indexOf(this.minLogLevel)
  }


  /**
   * Muestra un mensaje con formato de `Debug`. Mostrando un título (si se especifica) o una separación básica (*Defaults*).
   *
   * - `---------- ${title} ----------`
   * - `--------------------`
   *
   * @param data Data a mostrar.
   * @param title Título a mostrar.
   */
  public debug(data: unknown, title: string = ''): void {
    console.debug(this.formatDebugMessage(data, title))
  }


  /**
   * Muestra un log con el nivel proporcionado.
   *
   * @param logLevel Nivel de log.
   * @param data Datos a mostrar.
   */
  public log(logLevel: LogLevel, data: unknown): void {
    const msg = this.dataToString(data)

    switch (logLevel) {
      case 'INFO':
        this.info(msg)
        break
      case 'SUCCESS':
        this.success(msg)
        break
      case 'WARN':
        this.warn(msg)
        break
      case 'ERROR':
        this.error(msg)
        break
      default:
    }
  }
}
