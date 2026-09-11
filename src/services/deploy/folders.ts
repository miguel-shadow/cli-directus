import { join } from 'node:path'
import { FileSystemTools } from '@tools'
import {
  foldersResponseSchema,
  folderSchema,
  type DirectusApi,
  type DirectusApiFolder,
  type FoldersResume,
} from '@services'
import type { EnvConfig } from '@env'


const URL_PATH = '/folders'
const FOLDER_NAME = 'folders'


export async function deployFolders(env: EnvConfig, directusApi: DirectusApi): Promise<FoldersResume> {
  const folderPath = join(env.paths.src, FOLDER_NAME)

  const src = loadSrcData(folderPath)
  const apiData = await directusApi.getData(URL_PATH)
  const result = foldersResponseSchema.safeParse(apiData)

  if (!result.success) {
    throw result.error
  }

  const existingIds = new Set(result.data.data.map((item) => item.id))

  const resume: FoldersResume = {
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


function loadSrcData(folderPath: string): DirectusApiFolder[] {
  const data: DirectusApiFolder[] = []

  FileSystemTools.getFilesSync(folderPath, { recursive: true })
    .filter((entry) => entry.isFile())
    .forEach((entry) => {
      const content = FileSystemTools.readJsonSafeSync<object>(join(entry.parentPath, entry.name))
      data.push(folderSchema.parse(content))
    })

  return data
}
