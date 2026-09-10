import { join } from 'node:path'
import { FileSystemTools } from '@tools'
import {
  bookmarksResponseSchema,
  schemaDiffResponse,
  collectionSchema,
  bookmarkSchema,
  fieldSchema,
  relationSchema,
  type DirectusApi,
  type BookmarksResume,
  type SchemaDeployResume,
  type SchemaResume,
  type SchemasSrcData,
} from '@services'
import type { EnvConfig } from '@env'


const GROUP_FILENAME = 'group.json'
const COLLECTION_FILENAME = 'collection.json'
const META_FILENAME = 'meta.json'

const FIELDS_DIR_NAME = 'fields'
const RELATIONS_DIR_NAME = 'relations'
const BOOKMARKS_DIR_NAME = 'bookmarks'


export async function deploySchemas(env: EnvConfig, directusApi: DirectusApi): Promise<SchemaDeployResume> {
  const folderPath = join(env.paths.src, 'schemas')
  const srcData = loadSrcData(folderPath)

  const apiSchemaDiff = await directusApi.sendData('/schema/diff', 'POST', srcData.schema)
  const apiSchemaDiffResult = schemaDiffResponse.safeParse(apiSchemaDiff)

  if (!apiSchemaDiffResult.success) {
    throw apiSchemaDiffResult.error
  }

  const apiBookmarks = await directusApi.getData('/presets')
  const resultBookmarks = bookmarksResponseSchema.safeParse(apiBookmarks)

  if (!resultBookmarks.success) {
    throw resultBookmarks.error
  }

  const apiBookmarksIds = new Set(resultBookmarks.data.data.map((p) => p.id))

  const schemaResume: SchemaResume = {
    collections: [],
    fields: [],
    relations: [],
  }

  if (apiSchemaDiffResult.data !== null) {
    await directusApi.sendData('/schema/apply', 'POST', {
      hash: apiSchemaDiffResult.data.data.hash,
      diff: apiSchemaDiffResult.data.data.diff,
    })

    schemaResume.collections = apiSchemaDiffResult.data.data.diff.collections
    schemaResume.fields = apiSchemaDiffResult.data.data.diff.fields
    schemaResume.relations = apiSchemaDiffResult.data.data.diff.relations
  }

  const bookmarksResume: BookmarksResume = {
    existing: [],
    new: [],
  }

  for (const bookmark of srcData.bookmarks) {
    if (apiBookmarksIds.has(bookmark.id)) {
      bookmarksResume.existing.push(bookmark)
    } else {
      bookmarksResume.new.push(bookmark)
    }
  }

  if (bookmarksResume.existing.length > 0) {
    await await directusApi.sendData('/presets', 'PATCH', bookmarksResume.existing)
  }

  if (bookmarksResume.new.length > 0) {
    await await directusApi.sendData('/presets', 'POST', bookmarksResume.new)
  }

  return {
    schemaResume,
    bookmarksResume,
  }
}


function loadSrcData(folderPath: string): SchemasSrcData {
  const data: SchemasSrcData = {
    schema: {
      collections: [],
      fields: [],
      relations: [],
    },
    bookmarks: [],
  }

  FileSystemTools.getFilesSync(folderPath, { recursive: true })
    .filter((entry) => entry.isFile())
    .forEach((entry) => {
      const content = FileSystemTools.readJsonSafeSync<object>(join(entry.parentPath, entry.name))

      // Schemas Meta
      if (entry.name === META_FILENAME) {
        data.schema = {
          ...data.schema,
          ...content,
        }
      } else if (entry.name === COLLECTION_FILENAME || entry.name === GROUP_FILENAME) {
        // Schemas Collections & Groups
        data.schema.collections.push(collectionSchema.parse(content))
      } else if (entry.parentPath.includes(BOOKMARKS_DIR_NAME)) {
        // Bookmarks
        data.bookmarks.push(bookmarkSchema.parse(content))
      } else if (entry.parentPath.includes(FIELDS_DIR_NAME)) {
        // Schemas Fields
        data.schema.fields.push(fieldSchema.parse(content))
      } else if (entry.parentPath.includes(RELATIONS_DIR_NAME)) {
        // Schemas Relations
        data.schema.relations.push(relationSchema.parse(content))
      }
    })

  return data
}
