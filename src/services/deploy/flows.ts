import { join } from 'node:path'
import { FileSystemTools } from '@tools'
import {
  flowSchema,
  flowsResponseSchema,
  type DirectusApi,
  type DirectusApiFlow,
  type FlowsResume,
} from '@services'
import type { EnvConfig } from '@env'


const URL_FLOWS_PATH = '/flows?fields=*,operations.*&limit=-1'
const FOLDER_NAME = 'flows'
const MAIN_FILENAME = 'flow.json'


export async function deployFlows(env: EnvConfig, directusApi: DirectusApi): Promise<FlowsResume> {
  const flowPath = join(env.paths.src, FOLDER_NAME)
  const src = loadSrcData(flowPath)
  const apiData = await directusApi.getData(URL_FLOWS_PATH)
  const result = flowsResponseSchema.safeParse(apiData)

  if (!result.success) {
    throw result.error
  }

  const existingIds = new Set(result.data.data.map((item) => item.id))
  const resume: FlowsResume = {
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
    await directusApi.sendData(URL_FLOWS_PATH, 'POST', resume.new)
  }

  if (resume.existing.length > 0) {
    await directusApi.sendData(URL_FLOWS_PATH, 'PATCH', resume.existing)
  }

  return resume
}


function loadSrcData(flowPath: string): DirectusApiFlow[] {
  const map = new Map<string, DirectusApiFlow>()
  const entries = FileSystemTools.getFilesSync(flowPath, { recursive: true })

  entries
    .filter((entry) => entry.isFile() && entry.name === MAIN_FILENAME)
    .forEach((entry) => {
      const content = FileSystemTools.readJsonSafeSync(join(entry.parentPath, entry.name))
      const flow = flowSchema.parse(content)

      map.set(flow.id, flow)
    })

  entries
    .filter((entry) => entry.isFile() && entry.name !== MAIN_FILENAME)
    .forEach((entry) => {
      const content = FileSystemTools.readJsonSafeSync(join(entry.parentPath, entry.name))
      const item = flowSchema.shape.operations.unwrap().element.parse(content)

      const updated = map.get(item.flow)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      updated!.operations.push(item)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      map.set(item.flow, updated!)
    })

  return Array.from(map.values())
}
