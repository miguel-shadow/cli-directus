import chalk from 'chalk'
import type {
  FormatListOptions, FormatSubtitleOptions, FormatTitleOptions, DivisorOptions,
} from './types.js'


/**
 * Herramientas para formatear la salida de texto en consola.
 */
export const OutputTools = {
  divisor,
  formatList,
  formatSubtitle,
  formatTitle,
}


// Opciones por defecto
const DEFAULT_DIVISOR_OPTIONS: Required<DivisorOptions> = {
  char: '-',
  color: chalk.white,
  length: 50,
}

const DEFAULT_FORMAT_LIST_OPTIONS: Required<FormatListOptions> = {
  indentSize: 0,
  listChar: '-',
  listCharColor: null,
  textColor: null,
  showIndex: false,
}

const DEFAULT_FORMAT_SUBTITLE_OPTIONS: Required<FormatSubtitleOptions> = {
  divisorChar: '-',
  divisorColor: chalk.blueBright,
  divisorLength: 10,
  textColor: chalk.blueBright,
}

const DEFAULT_FORMAT_TITLE_OPTIONS: Required<FormatTitleOptions> = {
  divisorChar: '-',
  divisorColor: chalk.green,
  divisorLength: 20,
  textColor: chalk.blueBright,
}


/**
 * Retorna una cadena con forma de **divisor**.
 *
 * @param options Opciones del divisor:
 *
 * `char` *{string}* - Carácter a utilizar como divisor. Defaults `'-'`.
 *
 * `color` *{ChalkInstance | null}* - Color del divisor. Defaults `chalk.white`.
 *
 * `length` *{number}* - Cantidad de caracteres del divisor. Defaults `50`.
 *
 * @returns Divisor.
 *
 * @example
 * OutputTools.divisor()
 * // |--------------------------------------------------
 *
 * @example
 * OutputTools.divisor({
 *   char: '=',
 *   length: 25,
 *   color: chalk.green,
 * })
 * // |=========================
 */
function divisor(options: DivisorOptions = {}): string {
  const opts = {
    ...DEFAULT_DIVISOR_OPTIONS,
    ...options,
  }

  const div = opts.char.repeat(opts.length)
  return opts.color ? opts.color(div) : div
}


/**
 * Retorna una cadena de texto formateada como una lista.
 *
 * @param items Elementos a listar
 * @param options Opciones de formato:
 *
 * `indentSize` *{number}* - Tamaño de la indentación. Defaults `0`.
 *
 * `listChar` *{string}* - Carácter de la lista. Defaults `'-'`.
 *
 * `listCharColor` *{ChalkInstance | null}* - Instancia de chalk para colorear el carácter de lista. Por ejemplo `chalk.green`. Defaults `null`:
 *
 * `textColor` *{ChalkInstance | null}* - Instancia de chalk para colorear el texto. Por ejemplo `chalk.green`. Defaults `null`:
 *
 * `showIndex` *{boolean}* - Defaults `false`:
 * - `true`: Muestra el índice del elemento
 * - `false`: No se muestra el índice del elemento
 *
 * @returns Cadena formateada.
 *
 * @example
 * const items = ['Valor 1', 'Valor 2', 'Valor 3']
 * OutputTools.formatList(items)
 * // |- Valor 1
 * // |- Valor 2
 * // |- Valor 3
 *
 * @example
 * const items = ['Valor 1', 'Valor 2', 'Valor 3']
 * OutputTools.formatList(items, {
 *   indentSize: 4,
 *   listChar: '>',
 *   listCharColor: chalk.red,
 *   textColor: chalk.blueBright,
 * })
 * // |    > Valor 1
 * // |    > Valor 2
 * // |    > Valor 3
 *
 * @example
 * const items = ['Valor 1', 'Valor 2', 'Valor 3']
 * OutputTools.formatList(items, {
 *   indentSize: 2,
 *   listChar: '.',
 *   showIndex: true
 * })
 * // |  1. Valor 1
 * // |  2. Valor 2
 * // |  3. Valor 3
 */
function formatList(items: string[], options: FormatListOptions = {}): string {
  const {
    indentSize, listChar, listCharColor, textColor, showIndex,
  } = {
    ...DEFAULT_FORMAT_LIST_OPTIONS,
    ...options,
  }

  const list = ' '.repeat(indentSize) + (showIndex ? '{{index}}' : '') + (listCharColor ? listCharColor(listChar) : listChar)

  const coloredItems = textColor ? items.map((item) => textColor(item)) : items

  let index = 1
  return `${list} ${coloredItems.join(`\n${list} `)}`.replace(/\{\{index\}\}/g, () => String(index++))
}


/**
 * Retorna una cadena de texto formateada como un subtítulo.
 *
 * @param subtitle Texto del subtítulo.
 * @param options Opciones de formato:
 *
 * `divisorChar` *{string}* - Carácter a utilizar como divisor. Defaults `'-'`.
 *
 * `divisorColor` *{ChalkInstance | null}* - Color del divisor. Defaults `chalk.blueBright`.
 *
 * `divisorLength` *{number}* - Cantidad de caracteres del divisor. Defaults `10`.
 *
 * `textColor` *{ChalkInstance | null}* - Color del subtítulo. Defaults `chalk.blueBright`.
 *
 * @returns Cadena formateada.
 *
 * @example
 * OutputTools.formatSubtitle('Subtítulo')
 * // |---------- Subtítulo
 *
 * @example
 * OutputTools.formatSubtitle('Subtítulo', {
 *   divisorChar: '*',
 *   divisorLength: 5,
 *   textColor: chalk.red,
 *   divisorColor: chalk.yellow,
 * })
 * // |***** Subtítulo
 */
function formatSubtitle(subtitle: string, options: FormatSubtitleOptions = {}): string {
  const {
    divisorChar, divisorColor, divisorLength, textColor,
  } = {
    ...DEFAULT_FORMAT_SUBTITLE_OPTIONS,
    ...options,
  }

  const coloredDivisor = divisor({
    char: divisorChar,
    color: divisorColor,
    length: divisorLength,
  })

  return `${coloredDivisor} ${textColor ? textColor(subtitle) : subtitle}`
}


/**
 * Retorna una cadena de texto formateada como un título.
 *
 * @param title Texto del título
 * @param options Opciones de formato:
 *
 * `divisorChar` *{string}* - Carácter a utilizar como divisor. Defaults `'-'`.
 *
 * `divisorColor` *{ChalkInstance | null}* - Color del divisor. Defaults `chalk.green`.
 *
 * `divisorLength` *{number}* - Cantidad de caracteres del divisor. Defaults `20`.
 *
 * `textColor` *{ChalkInstance | null}* - Color del título. Defaults `chalk.blueBright`.
 *
 * @returns Cadena formateada.
 *
 * @example
 * OutputTools.formatTitle('Título')
 * // |-------------------- Título --------------------
 *
 * @example
 * OutputTools.formatTitle('Título', {
 *   divisorChar: '*',
 *   divisorLength: 5,
 *   textColor: chalk.red,
 *   divisorColor: chalk.yellow,
 * })
 * // |***** Título *****
 */
function formatTitle(title: string, options: FormatTitleOptions = {}): string {
  const {
    divisorChar, divisorColor, divisorLength, textColor,
  } = {
    ...DEFAULT_FORMAT_TITLE_OPTIONS,
    ...options,
  }

  const coloredDivisor = divisor({
    char: divisorChar,
    color: divisorColor,
    length: divisorLength,
  })

  return `${coloredDivisor} ${textColor ? textColor(title) : title} ${coloredDivisor}`
}
