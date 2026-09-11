import { join } from 'node:path'
import { FileSystemTools } from '@tools'
import {
  dashboardsResponseSchema,
  dashboardSchema,
  type DirectusApi,
  type DirectusApiDashboard,
  type DashboardsResume,
} from '@services'
import type { EnvConfig } from '@env'


const URL_PATH = '/dashboards?fields=*,panels.*&limit=-1'
const FOLDER_NAME = 'dashboards'
const MAIN_FILENAME = 'dashboard.json'


export async function deployDashboards(env: EnvConfig, directusApi: DirectusApi): Promise<DashboardsResume> {
  const dashboardPath = join(env.paths.src, FOLDER_NAME)

  const src = loadSrcData(dashboardPath)
  const apiData = await directusApi.getData(URL_PATH)
  const result = dashboardsResponseSchema.safeParse(apiData)

  if (!result.success) {
    throw result.error
  }

  const existingIds = new Set(result.data.data.map((item) => item.id))

  const resume: DashboardsResume = {
    existing: [],
    new: [],
  }

  for (const item of src) {
    if (existingIds.has(item.id)) {
      resume.existing.push(item)
    } else {
      resume.new.push(item)
    }
  }

  if (resume.existing.length > 0) {
    await await directusApi.sendData(URL_PATH, 'PATCH', resume.existing)
  }

  if (resume.new.length > 0) {
    await await directusApi.sendData(URL_PATH, 'POST', resume.new)
  }

  return resume
}


function loadSrcData(dashboardPath: string): DirectusApiDashboard[] {
  const map = new Map<string, DirectusApiDashboard>()

  const entries = FileSystemTools.getFilesSync(dashboardPath, { recursive: true })

  entries
    .filter((entry) => entry.isFile() && entry.name === MAIN_FILENAME)
    .forEach((entry) => {
      const content = FileSystemTools.readJsonSafeSync(join(entry.parentPath, entry.name))
      const item = dashboardSchema.parse(content)

      map.set(item.id, item)
    })

  entries
    .filter((entry) => entry.isFile() && entry.name !== MAIN_FILENAME)
    .forEach((entry) => {
      const content = FileSystemTools.readJsonSafeSync(join(entry.parentPath, entry.name))
      const item = dashboardSchema.shape.panels.unwrap().element.parse(content)

      const updated = map.get(item.dashboard)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      updated!.panels.push(item)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      map.set(item.dashboard, updated!)
    })

  return Array.from(map.values())
}
