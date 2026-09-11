import { join } from 'node:path'
import { FileSystemTools } from '@tools'
import {
  dashboardsResponseSchema,
  type DirectusApiDashboard,
  type DirectusApi,
} from '@services'
import type { EnvConfig } from '@env'


const URL_PATH = '/dashboards?fields=*,panels.*&limit=-1'
const FOLDER_NAME = 'dashboards'
const SUB_ITEMS_FOLDER_NAME = 'panels'
const MAIN_FILENAME = 'dashboard.json'


export async function retrieveDashboards(env: EnvConfig, directusApi: DirectusApi): Promise<DirectusApiDashboard[]> {
  const folderPath = join(env.paths.src, FOLDER_NAME)
  const data = await directusApi.getData(URL_PATH)

  const result = dashboardsResponseSchema.safeParse(data)

  if (!result.success) {
    throw result.error
  }

  await FileSystemTools.clearDir(folderPath)
  const promises: Array<Promise<boolean>> = []

  result.data.data.forEach((item) => {
    const folder = safeName(item.name)

    const {
      date_created: _,
      user_created: _2,
      panels,
      ...cleanData
    } = item
    promises.push(FileSystemTools.writeJson(join(folderPath, folder, MAIN_FILENAME), cleanData))

    panels.forEach((item2, index) => {
      const { date_created: _3, user_created: _4, ...cleanData2 } = item2

      promises.push(FileSystemTools.writeJson(join(
        folderPath,
        folder,
        SUB_ITEMS_FOLDER_NAME,
        `panel_${index}.json`,
      ), cleanData2))
    })
  })

  await Promise.all(promises)

  return result.data.data
}


function safeName(s: string): string {
  return FileSystemTools.safeName(s.toLowerCase(), {
    allowedChars: 'a-z0-9_\\s',
    replaceDiacritics: true,
    replaceSpaces: true,
  })
}
