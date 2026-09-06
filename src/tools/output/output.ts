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
  formatTemplate,
  formatTitle,
}

export class OutputToolsError extends Error {}


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
 * Formatea una plantilla con formato `{replace}` con los valoes introducidos. Admite tanto **índices númericos** como de **clave-valor**.
 *
 * @param template Plantilla a formatear.
 * @param values Valores con los que se reemplazarán la plantilla
 * - `string[]`: Array con los valores a sustituir. La plantilla debe tener el formato `'{0} {1} {2}...'`.
 * Los índices deben ser continuos comenzando por `0`, en caso contrario se lanza un error.
 * - `Record<string, string>`: Objeto con los valores a sustituir. La plantilla debe tener el formato `'{key} {key2} {key3}...'`.
 * Si no se encuentra una key para la plantilla se lanza un error.
 *
 * @returns Plantilla formateada.
 *
 * @example
 * const values = ['valor-1', 'valor-2']
 * OutputTools.formatTemplate('{0} y {1}', values)
 * // 'valor-1 y valor-2'
 *
 * @example
 * const values = ['valor-1', 'valor-2']
 * OutputTools.formatTemplate('{0} y {3}', values)
 * // ERROR
 *
 * @example
 * const values = { key: 'valor-1', keyExists: 'valor-2' }
 * OutputTools.formatTemplate('{key} y {keyExists}', values)
 * // 'valor-1 y valor-2'
 *
 * @example
 * const values = { key: 'valor-1', keyNotExists: 'valor-2' }
 * OutputTools.formatTemplate('{key} y {keyExists}', values)
 * // ERROR
 */
function formatTemplate(template: string, values: string[] | Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    // {index}
    if (Array.isArray(values)) {
      const index = Number(key)

      if (!Number.isInteger(index)) {
        throw new OutputToolsError(`'El índice {${key}}' debe ser un número entero positivo. Plantilla '${template}'`)
      }

      if (typeof values[index] === 'undefined') {
        throw new OutputToolsError(`Falta el valor para el índice '{${key}}'. Plantilla '${template}'`)
      }

      return values[index]
    }

    // {key}
    const keyString = String(key)
    if (typeof values[keyString] === 'undefined') {
      throw new OutputToolsError(`Falta el valor para la clave '{${key}}'. Plantilla '${template}'`)
    }

    return values[keyString]
  })
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
