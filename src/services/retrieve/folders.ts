import { join } from 'node:path'
import { FileSystemTools } from '@tools'
import {
  foldersResponseSchema,
  type DirectusApi,
  type DirectusApiFoldersResponse,
  type DirectusApiFolder,
  type FolderTree,
} from '@services'
import type { EnvConfig } from '@env'


const URL_PATH = '/folders?limit=-1'
const FOLDER_NAME = 'folders'
const MAIN_FILENAME = '_main.json'


export async function retrieveFolders(env: EnvConfig, directusApi: DirectusApi): Promise<FolderTree[]> {
  const folderPath = join(env.paths.src, FOLDER_NAME)
  const data = await directusApi.getData(URL_PATH)

  const result = foldersResponseSchema.safeParse(data)

  if (!result.success) {
    throw result.error
  }

  const folders = buildTree(result.data)

  await FileSystemTools.clearDir(folderPath)
  const promises: Array<Promise<boolean>> = []

  folders.forEach((item) => {
    if (item.hasChildrens) {
      promises.push(FileSystemTools.writeJson(join(folderPath, item.path, MAIN_FILENAME), item.folder))
    } else {
      promises.push(FileSystemTools.writeJson(join(folderPath, `${item.path}.json`), item.folder))
    }
  })

  await Promise.all(promises)

  return folders
}


function buildTree(data: DirectusApiFoldersResponse): FolderTree[] {
  const array: FolderTree[] = []
  const map = new Map<string, DirectusApiFolder>()
  const parentIds = new Set<string>()

  data.data.forEach((item) => {
    map.set(item.id, item)

    if (item.parent !== null) {
      parentIds.add(item.parent)
    }
  })

  data.data.forEach((item) => {
    array.push({
      id: item.id,
      name: item.name,
      path: getFullPath(map, item),
      hasChildrens: parentIds.has(item.id),
      folder: item,
    })
  })


  return array.sort((a, b) => a.path.localeCompare(b.path))
}


function safeName(s: string): string {
  return FileSystemTools.safeName(s.toLowerCase(), {
    allowedChars: 'a-z0-9_\\s',
    replaceDiacritics: true,
    replaceSpaces: true,
  })
}


function getFullPath(map: Map<string, DirectusApiFolder>, folder: DirectusApiFolder): string {
  if (folder.parent === null) {
    return safeName(folder.name)
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return join(getFullPath(map, map.get(folder.parent)!), safeName(folder.name))
}
