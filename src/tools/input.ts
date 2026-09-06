import { stdin as input, stdout as output } from 'node:process'
import * as readline from 'node:readline/promises'


/**
 * Contiene utilidades relacionadas con la entrada de datos por parte del usuario
 */
export const InputTools = {
  readLine,
  readLines,
}


/**
 * Permite al usuario **introducir una línea** de texto mostrando el prompt indicado.
 *
 * @param prompt El texto que se mostrará al usuario para indicarle que introduzca una línea. Defaults `'> '`.
 * @param rl Una instancia de `readline.Interface` para reutilizar. Si no se proporciona,
 * se creará una nueva instancia y se cerrará automáticamente después de leer la línea.
 *
 * @returns Retorna la línea introducida por el usuario.
 *
 * @example
 * await InputTools.readLine()
 * // |>
 *
 * @example
 * await InputTools.readLine('Introduce una línea: ')
 * // |Introduce una línea:
 */
async function readLine(prompt: string = '> ', rl?: readline.Interface): Promise<string> {
  const instance = rl ?? readline.createInterface({ input, output })

  try {
    return await instance.question(prompt)
  } finally {
    if (!rl) {
      instance.close()
    }
  }
}


/**
 * Permite al usuario **introducir líneas** de texto individuales.
 *
 * @param finisher La línea de texto que el usuario debe introducir para finalizar la entrada de datos. Defaults `''` (línea vacía).
 * @param rl Una instancia de `readline.Interface` para reutilizar. Si no se proporciona,
 * se creará una nueva instancia y se cerrará automáticamente después de leer las líneas.
 *
 * @returns Retorna un array con las líneas introducidas por el usuario, sin incluir la última de terminación.
 *
 * @example
 * await InputTools.readLines()
 *
 * @example
 * await InputTools.readLines('exit')
 */
async function readLines(finisher: string = '', rl?: readline.Interface): Promise<string[]> {
  const instance = rl ?? readline.createInterface({ input, output })
  const finish = finisher.toLowerCase()

  const result: string[] = []

  try {
    for await (const l of instance) {
      const line = l.trim().toLowerCase()

      if (line === finish) {
        break
      }

      result.push(line)
    }
  } finally {
    if (!rl) {
      instance.close()
    }
  }

  return result
}
