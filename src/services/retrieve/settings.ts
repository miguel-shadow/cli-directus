import { FileSystemTools } from '@tools'
import type { DirectusApi } from '../api/index.js'
import { settingsResponseSchema } from '../schemas.js'
import type { EnvConfig } from '@env'
import { join } from 'node:path'


export async function retrieveSettings(env: EnvConfig, directusApi: DirectusApi): Promise<void> {
  const folderPath = join(env.paths.src, 'settings')
  const data = await directusApi.getData('/settings')

  const result = settingsResponseSchema.safeParse(data)

  if (!result.success) {
    throw result.error
  }

  const settings = result.data.data

  settings.project_name = '{!DIRECTUS_PROJECT_NAME}'
  settings.project_url = '{!DIRECTUS_PROJECT_URL}'
  settings.project_descriptor = '{!DIRECTUS_PROJECT_DESCRIPTION}'
  settings.project_id = '{!DIRECTUS_PROJECT_ID}'
  settings.project_owner = '{!DIRECTUS_PROJECT_OWNER_EMAIL}'

  await FileSystemTools.clearDir(folderPath)
  await FileSystemTools.writeJson(join(folderPath, 'settings.json'), settings)
}
