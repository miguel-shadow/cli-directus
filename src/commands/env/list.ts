/* eslint-disable no-console */
import chalk from 'chalk'
import { OutputTools } from '@tools'
import type { EnvCommandOptions, EnvListActionOptions } from './types.js'


export function listAction(params: EnvCommandOptions, options: EnvListActionOptions): void {
  console.log(OutputTools.formatTitle('Directus CLI - Listar entornos'))
  console.log()

  const { logger, directusEnv } = params
  const envs = directusEnv.getAll()
  const currentEnv = directusEnv.getCurrent()

  if (envs.length === 0) {
    console.log(chalk.red('No hay entornos configurados.'))
    return
  }

  const rows = envs.map((env) => {
    const isActive = env.alias === currentEnv?.alias
    const chalkInstance = isActive ? chalk.green : chalk.blueBright
    const chalkInstanceSecundary = isActive ? chalk.green : chalk.white

    let message = `${chalkInstance(isActive ? '●' : '○')} ${chalkInstanceSecundary(env.alias)}`

    const token = options.showSecrets ? env.token : '*'.repeat(env.token.length)
    message += `\n${OutputTools.formatList([
      `URL: ${chalk.underline(chalkInstance(env.url))}`,
      `Email: ${chalkInstance(formatEmail(env.email, options.showSecrets))}`,
      `Token: ${chalkInstance(token)}`,
      `Proyecto: \n${OutputTools.formatList([
        `ID: ${chalkInstance(env.project.id)}`,
        `Nombre: ${chalkInstance(env.project.name)}`,
        `Descripción: ${chalkInstance(env.project.description)}`,
        `Owner email: ${chalkInstance(formatEmail(env.project.ownerEmail, options.showSecrets))}`,
      ], {
        indentSize: 8,
        listChar: '+',
      })}`,
    ], {
      indentSize: 4,
    })}`

    return `${message}\n`
  })

  logger.log('INFO', `${chalk.white('Entornos configurados:')}\n\n${OutputTools.formatList(rows, { listChar: '' })}`)

  if (currentEnv === null) {
    console.log()
    console.log(chalk.red('No se ha encontrado ningún entorno activo en la carpeta actual.'))
  }
}


function formatEmail(email: string, showSecrets: boolean): string {
  if (showSecrets) {
    return email
  }

  const visibleChars = 5
  const [username, domain] = email.split('@')

  if (typeof username === 'undefined' || typeof domain === 'undefined') {
    return email
  }

  let secretUsername = username
  if (username.length > visibleChars) {
    secretUsername = username.slice(0, visibleChars) + '*'.repeat(username.slice(visibleChars).length)
  }

  return `${secretUsername}@${'*'.repeat(domain.length)}`
}
