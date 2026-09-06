import { FileSystemTools } from '@tools'
import type { DirectusApi } from '../api/index.js'
import type { EnvConfig } from '@env'
import { join } from 'node:path'
import { settingsSchema } from '../schemas.js'
import type { DirectusEnv } from '../env/index.js'


export async function deploySettings(env: EnvConfig, directusEnv: DirectusEnv, directusApi: DirectusApi): Promise<void> {
  const filePath = join(env.paths.src, 'settings', 'settings.json')
  const data = await FileSystemTools.readJson(filePath)

  const result = settingsSchema.safeParse(data)

  if (!result.success) {
    throw result.error
  }

  const settings = result.data
  const currentEnv = directusEnv.getCurrent()

  if (currentEnv === null) {
    throw new Error('No hay un entorno de Directus activo en la carpeta actual')
  }

  settings.project_name = currentEnv.project.name
  settings.project_url = currentEnv.url
  settings.project_descriptor = currentEnv.project.description
  settings.project_id = currentEnv.project.id
  settings.project_owner = currentEnv.project.ownerEmail

  await directusApi.sendData('/settings', 'PATCH', settings)
}
