import { join } from 'node:path'
import { FileSystemTools } from '@tools'
import { settingsSchema, type DirectusApi, type DirectusEnv } from '@services'
import type { EnvConfig } from '@env'


export async function deploySettings(env: EnvConfig, directusApi: DirectusApi): Promise<void> {
  const filePath = join(env.paths.src, 'settings', 'settings.json')
  const data = await FileSystemTools.readJson(filePath)

  const result = settingsSchema.safeParse(data)

  if (!result.success) {
    throw result.error
  }

  const settings = result.data
  const currentEnv = directusApi.directusEnvData

  settings.project_name = currentEnv.project.name
  settings.project_url = currentEnv.url
  settings.project_descriptor = currentEnv.project.description
  settings.project_id = currentEnv.project.id
  settings.project_owner = currentEnv.project.ownerEmail

  await directusApi.sendData('/settings', 'PATCH', settings)
}
