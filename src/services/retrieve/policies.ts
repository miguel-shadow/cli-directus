import { join } from 'node:path'
import { FileSystemTools } from '@tools'
import {
  policiesResponseSchema,
  type DirectusApi,
  type DirectusApiPolicy,
} from '@services'
import type { EnvConfig } from '@env'


const URL_PATH = '/policies?fields=*,permissions.*&limit=-1'
const FOLDER_NAME = 'policies'
const SUB_ITEMS_FOLDER_NAME = 'permissions'
const MAIN_FILENAME = 'policy.json'
const EXCLUDE_POLICIES = [ 'Administrator' ]
const PUBLIC_POLICY_NAME = 'public'


export async function retrievePolicies(env: EnvConfig, directusApi: DirectusApi): Promise<DirectusApiPolicy[]> {
  const folderPath = join(env.paths.src, FOLDER_NAME)
  const data = await directusApi.getData(URL_PATH)

  const result = policiesResponseSchema.safeParse(data)

  if (!result.success) {
    throw result.error
  }

  const policies = result.data.data.filter((policy) => !EXCLUDE_POLICIES.includes(policy.name))

  await FileSystemTools.clearDir(folderPath)
  const promises: Array<Promise<boolean>> = []

  policies.forEach((item) => {
    const folder = safeName(item.name)
    const {
      roles: _,
      users: _2,
      permissions,
      ...cleanData
    } = item

    promises.push(FileSystemTools.writeJson(join(folderPath, folder, MAIN_FILENAME), cleanData))

    permissions.forEach((permission) => {
      promises.push(FileSystemTools.writeJson(join(
        folderPath,
        folder,
        SUB_ITEMS_FOLDER_NAME,
        `${safeName(permission.collection)}__${safeName(permission.action)}.json`,
      ), permission))
    })
  })

  await Promise.all(promises)

  return policies
}


function safeName(s: string): string {
  const name = FileSystemTools.safeName(s.toLowerCase(), {
    allowedChars: 'a-z0-9_\\s',
    replaceDiacritics: true,
    replaceSpaces: true,
  })

  return name === '_t_public_label' ? PUBLIC_POLICY_NAME : name
}
