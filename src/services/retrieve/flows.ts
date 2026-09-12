import { join } from 'node:path'
import { FileSystemTools } from '@tools'
import {
  flowsResponseSchema,
  type DirectusApi,
  type DirectusApiFlow,
} from '@services'
import type { EnvConfig } from '@env'


const URL_PATH = '/flows?fields=*,operations.*&limit=-1'
const FOLDER_NAME = 'flows'
const SUB_ITEMS_FOLDER_NAME = 'operations'
const MAIN_FILENAME = 'flow.json'


export async function retrieveFlows(env: EnvConfig, directusApi: DirectusApi): Promise<DirectusApiFlow[]> {
  const folderPath = join(env.paths.src, FOLDER_NAME)
  const data = await directusApi.getData(URL_PATH)

  const result = flowsResponseSchema.safeParse(data)

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
      operations,
      ...cleanData
    } = item

    promises.push(FileSystemTools.writeJson(join(folderPath, folder, MAIN_FILENAME), cleanData))

    operations.forEach((operation, index) => {
      const {
        date_created: _3,
        user_created: _4,
        ...cleanOperationData
      } = operation

      promises.push(FileSystemTools.writeJson(join(
        folderPath,
        folder,
        SUB_ITEMS_FOLDER_NAME,
        `operation_${index}__${safeName(operation.name)}.json`,
      ), cleanOperationData))
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
