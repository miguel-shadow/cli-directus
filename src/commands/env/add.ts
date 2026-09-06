/* eslint-disable no-console */
import inquirer from 'inquirer'
import chalk from 'chalk'
import { OutputTools } from '@tools'
import {
  directusEnvDataSchema,
  ENV_DATA_DEFAULT_VALUES,
  type DirectusEnvData,
  type DirectusEnvDataProject,
} from '@services'
import type { EnvCommandOptions } from './types.js'


export async function addAction(params: EnvCommandOptions): Promise<void> {
  console.log(OutputTools.formatTitle('Directus CLI - Añadir entorno'))
  console.log()

  const { logger, directusEnv, directusApi } = params
  const existingEnvs = directusEnv.getAll()

  const alias = await askAlias(existingEnvs)
  const url = await askUrl()
  const email = await askEmail()
  const token = await askToken()
  const project = await askProject(email)

  const newEnv = directusEnv.add({
    alias,
    url,
    email,
    token,
    project,
  })

  console.log(OutputTools.divisor())

  // Comprobar credenciales sin bloquear
  try {
    directusApi.directusEnvData = newEnv
    await directusApi.checkConnection()
  } catch {
    console.log()
    logger.log('ERROR', 'Se ha producido un error al comprobar las credenciales del entorno')
    console.log()
  }

  const { active } = await inquirer.prompt<{ active: boolean }>([
    {
      type: 'confirm',
      name: 'active',
      message: '¿Establecer el entorno como activo?',
      default: true,
    },
  ])

  if (active) {
    directusEnv.setCurrent(newEnv.alias)
  }

  console.log()
  logger.log('SUCCESS', `Entorno '${newEnv.alias} (${chalk.underline(newEnv.url)})' añadido${active ? ' y establecido como activo' : ''}.`)
}


async function askAlias(existingEnvs: DirectusEnvData[]): Promise<string> {
  const { input } = await inquirer.prompt<{ input: string }>({
    type: 'input',
    name: 'input',
    required: true,
    message: 'Alias del entorno (solo puede contener letras minúsculas, números, guiones y guiones bajos y no pueden existir duplicados):',
  })

  const result = directusEnvDataSchema.shape.alias.safeParse(input)

  if (!result.success) {
    throw result.error
  }

  const alias = result.data
  if (existingEnvs.some((env) => env.alias === alias)) {
    throw new Error(`Ya existe un entorno con el alias '${alias}'. Utilice un alias diferente.`)
  }

  return alias
}


async function askUrl(): Promise<string> {
  const { input } = await inquirer.prompt<{ input: string }>({
    type: 'input',
    name: 'input',
    required: true,
    message: 'URL del entorno:',
  })

  const result = directusEnvDataSchema.shape.url.safeParse(input)

  if (!result.success) {
    throw result.error
  }

  return result.data
}


async function askEmail(): Promise<string> {
  const { input } = await inquirer.prompt<{ input: string }>({
    type: 'input',
    name: 'input',
    required: true,
    message: 'Correo electrónico del usuario:',
  })

  const result = directusEnvDataSchema.shape.email.safeParse(input)

  if (!result.success) {
    throw result.error
  }

  return result.data
}


async function askToken(): Promise<string> {
  const { input } = await inquirer.prompt<{ input: string }>({
    type: 'password',
    name: 'input',
    required: true,
    message: 'Token de acceso API del usuario:',
  })

  const result = directusEnvDataSchema.shape.token.safeParse(input)

  if (!result.success) {
    throw result.error
  }

  return result.data
}


async function askProject(defaultProjectOwner: string): Promise<DirectusEnvDataProject> {
  const DEFAULT_PROJECT_ID = ENV_DATA_DEFAULT_VALUES.project.id()

  const answers = await inquirer.prompt<{
    projectDescription: string
    projectId: string
    projectName: string
    projectOwner: string
  }>([
    {
      type: 'input',
      name: 'projectName',
      message: 'Nombre del proyecto:',
      default: ENV_DATA_DEFAULT_VALUES.project.name,
    },
    {
      type: 'input',
      name: 'projectDescription',
      message: 'Descripción del proyecto:',
      default: ENV_DATA_DEFAULT_VALUES.project.description,
    },
    {
      type: 'input',
      name: 'projectOwner',
      message: 'Email del owner del proyecto:',
      default: defaultProjectOwner,
    },
    {
      type: 'input',
      name: 'projectId',
      message: 'UUID del proyecto:',
      default: DEFAULT_PROJECT_ID,
    },
  ])

  return {
    name: answers.projectName.trim() || ENV_DATA_DEFAULT_VALUES.project.name,
    description: answers.projectDescription.trim() || ENV_DATA_DEFAULT_VALUES.project.description,
    id: answers.projectId.trim() || DEFAULT_PROJECT_ID,
    ownerEmail: answers.projectOwner.trim() || defaultProjectOwner,
  }
}
