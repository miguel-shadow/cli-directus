/**
 * Proporciona utilidades relacionadas con el tiempo
 */
export const TimeTools = {
  sleep,
}


/**
 * Realiza una **pausa asíncrona** especificada en **milisegundos**. Para milisegundos *negativos* o `0` se resuelve inmediatamente.
 *
 * @param ms Número de milisegundos a pausar.
 *
 * @example
 * await TimeTools.sleep(1000) // Pausa 1 segundo
 */
async function sleep(ms: number): Promise<void> {
  if (ms < 1) {
    return Promise.resolve()
  }

  return new Promise((r) => { setTimeout(r, ms) })
}
