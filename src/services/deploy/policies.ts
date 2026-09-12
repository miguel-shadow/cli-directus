import { join } from 'node:path'
import { FileSystemTools } from '@tools'
import {
  policiesResponseSchema,
  policySchema,
  type DirectusApi,
  type DirectusApiPolicy,
  type PoliciesResume,
} from '@services'
import type { EnvConfig } from '@env'


const URL_PATH = '/policies?fields=*,permissions.*&limit=-1'
const FOLDER_NAME = 'policies'
const MAIN_FILENAME = 'policy.json'


export async function deployPolicies(env: EnvConfig, directusApi: DirectusApi): Promise<PoliciesResume> {
  const policyPath = join(env.paths.src, FOLDER_NAME)

  const src = loadSrcData(policyPath)
  const apiData = await directusApi.getData(URL_PATH)
  const result = policiesResponseSchema.safeParse(apiData)

  if (!result.success) {
    throw result.error
  }

  const existingIds = new Set(result.data.data.map((item) => item.id))

  const resume: PoliciesResume = {
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

  if (resume.new.length > 0) {
    await directusApi.sendData(URL_PATH, 'POST', resume.new)
  }

  if (resume.existing.length > 0) {
    await directusApi.sendData(URL_PATH, 'PATCH', resume.existing)
  }

  return resume
}


function loadSrcData(policyPath: string): DirectusApiPolicy[] {
  const map = new Map<string, DirectusApiPolicy>()

  const entries = FileSystemTools.getFilesSync(policyPath, { recursive: true })

  entries
    .filter((entry) => entry.isFile() && entry.name === MAIN_FILENAME)
    .forEach((entry) => {
      const content = FileSystemTools.readJsonSafeSync(join(entry.parentPath, entry.name))
      const item = policySchema.parse(content)

      map.set(item.id, item)
    })

  entries
    .filter((entry) => entry.isFile() && entry.name !== MAIN_FILENAME)
    .forEach((entry) => {
      const content = FileSystemTools.readJsonSafeSync(join(entry.parentPath, entry.name))
      const item = policySchema.shape.permissions.unwrap().element.parse(content)

      const updated = map.get(item.policy)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      updated!.permissions.push(item)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      map.set(item.policy, updated!)
    })

  return Array.from(map.values())
}
