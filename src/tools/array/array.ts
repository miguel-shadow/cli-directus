import type { SortObjectsOptions, SortOptions } from './types.js'


export const ArrayTools = {
  shuffle,
  sort,
  sortObjects,
}


// Valores por defecto
const DEFAULT_SORT_OPTIONS: Required<SortOptions> = {
  alphanumeric: false,
  reverse: false,
  type: 'string',
}

const DEFAULT_SORT_OBJECTS_OPTIONS: Partial<SortObjectsOptions> = {
  alphanumeric: false,
}


/**
 * **Mezcla** de forma aleatoria un array sin modificar el array original.
 *
 * @param array Array a mezclar.
 *
 * @returns Array mezclado.
 */
function shuffle<T>(array: T[]): T[] {
  const shuffledArray = [ ...array ]

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j] as T, shuffledArray[i] as T]
  }

  return shuffledArray
}


/**
 * **Ordena** un **array de primitivos** sin modificar el array original con las opciones especificadas.
 *
 * @param array Array a ordenar.
 * @param options Opciones de ordenación (`SortOptions` para ver las opciones disponibles):
 *
 * `type` *{string}* - Defaults `'string'`:
 * - `'string'`: Ordena como cadenas.
 * - `'number'`: Ordena como números. Si el valor no es un número válido se ordenan como cadenas.
 * - `'date'`: Ordena como fechas (en formato cadena, timestamp...). Si el valor no es una fecha válida se ordenan como cadenas.
 * - `'length'`: Ordena mediante la longitud de las cadenas. Si dos cadenas son iguales, se ordenan alfabéticamente.
 *
 * *Si el valor a comprobar no es un `type` válido, se ordenará como una `string`.
 *
 * `alphanumeric` *{boolean}* - Solo afecta con `type: 'string'`. Defaults `false`:
 * - `true`: Los números en una cadena se comportan como un número normal. Por ejemplo `10 > 2`.
 * - `false`: Los números en una cadena se comportan como una cadena. Por ejemplo `10 < 2`.
 *
 * `reverse`: *{boolean}* - Defaults `false`:
 * - `true`: Retorna el array ordenado de forma inversa (descendente).
 * - `false`: Retorna el array ordenado ascendente.
 *
 * @returns Array ordenado.
 *
 * @example
 * const array = ['c', 'a', 'b']
 * const sortedArray = ArrayTools.sort(array)
 * // ['a', 'b', 'c']
 *
 * @example
 * const array = ['c', 'a', 'b']
 * const sortedArray = ArrayTools.sort(array, { reverse: true })
 * // ['c', 'b', 'a']
 *
 * @example
 * const array = ['test10', 'test21', 'test2']
 * const sortedArray = ArrayTools.sort(array)
 * // ['test10', 'test2', 'test21']
 *
 * @example
 * const array = ['test10', 'test21', 'test2']
 * const sortedArray = ArrayTools.sort(array, { alphanumeric: true })
 * // ['test2', 'test10', 'test21']
 *
 * @example
 * const array = [10, 2, 30]
 * const sortedArray = ArrayTools.sort(array)
 * // [10, 2, 30]
 *
 * @example
 * const array = [10, 2, 30]
 * const sortedArray = ArrayTools.sort(array, { type: 'number' })
 * // [2, 10, 30]
 *
 * @example
 * const array = ['2026-05-03', new Date(), 1767759759026]
 * const sortedArray = ArrayTools.sort(array, { type: 'date' })
 * // [1767759759026, '2026-05-03', new Date()]
 */
function sort<T>(array: T[], options: SortOptions = {}): T[] {
  const opts: Required<SortOptions> = {
    ...DEFAULT_SORT_OPTIONS,
    ...options,
  }

  const sortedArray = [ ...array ].sort((a, b) => sortCompare(a, b, opts))

  return opts.reverse ? sortedArray.reverse() : sortedArray
}


/**
 * **Ordena** un **array** de **objetos** o **instancias** según uno o varios campos (permitiendo multi-niveles y métodos).
 *
 * @param array Array a ordenar.
 * @param options Opciones de ordenación:
 *
 * `sortKeys` *{string | string[]}* - Claves de ordenación. Admite varios niveles de ordenación:
 * - `'<key>'`: Ordena por la clave `item.key`.
 * - `['<key>', '<key2>`]: Ordena por la clave `item.key` y después por la clave `item.key2`.
 *
 * Admite multi-niveles y ordenación ascendente y descendente (con `-` delante de la clave): Por ejemplo: `'key.key2'`, `['-key.key2.key3', 'key4']`.
 *
 * También admite métodos de clase (no deben requerir parámetros). Por ejemplo: `'method'` se ejecuta `item.method()`.
 *
 * `alphanumeric` *{boolean}* - Solo afecta al comparar `string`. Defaults `false`:
 * - `true`: Los números en una cadena se comportan como un número normal. Por ejemplo `10 > 2`.
 * - `false`: Los números en una cadena se comportan como una cadena. Por ejemplo `10 < 2`.
 *
 * @returns Array ordenado
 *
 * @example
 * const array = [
 *  { name: 'Charlie', age: 35, address: { city: 'Valencia', zip: 46001 } },
 *  { name: 'Dylan', age: 30, address: { city: 'Barcelona', zip: 80000 } },
 *  { name: 'Alice', age: 30, address: { city: 'Madrid', zip: 28001 } },
 *  { name: 'Bob', age: 25, address: { city: 'Barcelona', zip: 80001 } },
 * ]
 * const sortedArray = ArrayTools.sortObjects(array, { sortKeys: 'age' })
 *
 * // [
 * //   { name: 'Bob', age: 25, address: { city: 'Barcelona', zip: 80001 } },
 * //   { name: 'Dylan', age: 30, address: { city: 'Barcelona', zip: 80000 } },
 * //   { name: 'Alice', age: 30, address: { city: 'Madrid', zip: 28001 } },
 * //   { name: 'Charlie', age: 35, address: { city: 'Valencia', zip: 46001 } },
 * // ]
 *
 * @example
 * const array = [
 *  { name: 'Charlie', age: 35, address: { city: 'Valencia', zip: 46001 } },
 *  { name: 'Dylan', age: 30, address: { city: 'Barcelona', zip: 80000 } },
 *  { name: 'Alice', age: 30, address: { city: 'Madrid', zip: 28001 } },
 *  { name: 'Bob', age: 25, address: { city: 'Barcelona', zip: 80001 } },
 * ]
 * const sortedArray = ArrayTools.sortObjects(array, { sortKeys: ['-age', 'name'] })
 *
 * // [
 * //   { name: 'Charlie', age: 35, address: { city: 'Valencia', zip: 46001 } },
 * //   { name: 'Alice', age: 30, address: { city: 'Madrid', zip: 28001 } },
 * //   { name: 'Dylan', age: 30, address: { city: 'Barcelona', zip: 80000 } },
 * //   { name: 'Bob', age: 25, address: { city: 'Barcelona', zip: 80001 } },
 * // ]
 *
 * @example
 * const array = [
 *  { name: 'Charlie', age: 35, address: { city: 'Valencia', zip: 46001 } },
 *  { name: 'Dylan', age: 30, address: { city: 'Barcelona', zip: 80000 } },
 *  { name: 'Alice', age: 30, address: { city: 'Madrid', zip: 28001 } },
 *  { name: 'Alexander', age: 20, address: { city: 'Barcelona', zip: 80000 } },
 *  { name: 'Bob', age: 25, address: { city: 'Barcelona', zip: 80001 } },
 * ]
 * const sortedArray = ArrayTools.sortObjects(array, { sortKeys: ['address.city', '-address.zip', 'name'] })
 *
 * // [
 * //   { name: 'Bob', age: 25, address: { city: 'Barcelona', zip: 80001 } },
 * //   { name: 'Alexander', age: 20, address: { city: 'Barcelona', zip: 80000 } },
 * //   { name: 'Dylan', age: 30, address: { city: 'Barcelona', zip: 80000 } },
 * //   { name: 'Alice', age: 30, address: { city: 'Madrid', zip: 28001 } },
 * //   { name: 'Charlie', age: 35, address: { city: 'Valencia', zip: 46001 } },
 * // ]
 *
 * @example
 * interface Address {
 *   city: string
 *   zip: number
 * }
 *
 * class Person {
 *   name: string
 *   age: number
 *   address: Address
 *
 *   constructor(name: string, age: number, address: Address) {
 *     this.name = name
 *     this.age = age
 *     this.address = address
 *   }
 *
 *   getName(): string {
 *     return this.name
 *   }
 * }
 *
 * const array: Person[] = [
 *   new Person('Charlie', 35, { city: 'Valencia', zip: 46001 }),
 *   new Person('Dylan', 30, { city: 'Barcelona', zip: 80000 }),
 *   new Person('Alice', 30, { city: 'Madrid', zip: 28001 }),
 *   new Person('Alexander', 20, { city: 'Barcelona', zip: 80000 }),
 *   new Person('Bob', 25, { city: 'Barcelona', zip: 80001 }),
 * ]
 *
 * const sortedArray = ArrayTools.sortObjects(array, { sortKeys: ['address.city', '-getName'] })
 *
 * // [
 * //   Person{name: 'Dylan', age: 30, address: { city: 'Barcelona', zip: 80000 }}
 * //   Person{name: 'Bob', age: 25, address: { city: 'Barcelona', zip: 80001 })}
 * //   Person{name: 'Alexander', age: 20, address: { city: 'Barcelona', zip: 80000 })}
 * //   Person{name: 'Alice', age: 30, address: { city: 'Madrid', zip: 28001 })}
 * //   Person{name: 'Charlie', age: 35, address: { city: 'Valencia', zip: 46001 })}
 * // ]
 */
function sortObjects<T>(array: T[], options: SortObjectsOptions): T[] {
  const opts = {
    ...DEFAULT_SORT_OBJECTS_OPTIONS,
    ...options,
  }
  const sortKeys = Array.isArray(opts.sortKeys) ? opts.sortKeys : [ opts.sortKeys ]

  return [ ...array ].sort((a, b) => {
    for (const key of sortKeys) {
      let reverse = false
      let path = key

      if (key.startsWith('-')) {
        reverse = true
        path = key.slice(1)
      }

      const valA = getSortObjectValueByPath(a, path)
      const valB = getSortObjectValueByPath(b, path)

      let comparison

      if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB
      } else {
        // eslint-disable-next-line no-undefined
        comparison = String(valA).localeCompare(String(valB), undefined, {
          numeric: Boolean(opts.alphanumeric),
        })
      }

      if (comparison !== 0) {
        return reverse ? -comparison : comparison
      }
      // si son iguales, pasa al siguiente campo
    }

    return 0
  })
}


// Helpers


/**
 * Obtiene un valor de un objeto o instancia mediante un path 'key.subkey'.
 */
function getSortObjectValueByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc, key) => {
    if (acc !== null && typeof acc === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      const value = (acc as Record<string, unknown>)[key]

      // Ejecutar si es un método
      if (typeof value === 'function') {
        try {
          return value.call(acc)
        } catch {
          return null
        }
      }

      // Valor
      return value
    }

    return null
  }, obj)
}


/**
 * Compara dos valores según las opciones introducidas.
 *
 * @param a Valor 1 a comparar.
 * @param b Valor 2 a comparar.
 * @param options Opciones de comparación.
 *
 * @returns Diferencia de ordenación.
 */
function sortCompare(a: unknown, b: unknown, options: SortOptions): number {
  switch (options.type) {
    case 'number': {
      const numA = Number(a)
      const numB = Number(b)

      if (Number.isNaN(numA) || Number.isNaN(numB)) {
        break
      }

      return numA - numB
    }

    case 'date': {
      if (
        !(a instanceof Date) && typeof a !== 'string' && typeof a !== 'number' ||
        !(b instanceof Date) && typeof b !== 'string' && typeof b !== 'number'
      ) {
        break
      }

      const dateA = new Date(a).getTime()
      const dateB = new Date(b).getTime()

      if (Number.isNaN(dateA) || Number.isNaN(dateB)) {
        break
      }

      return dateA - dateB
    }

    case 'length':
      const result = String(a).length - String(b).length

      if (result === 0) {
        break
      }

      return result

    case 'string':
    default:
  }

  return String(a).localeCompare(String(b), '', {
    numeric: options.alphanumeric,
  })
}
