import { join } from 'node:path'
import { FileSystemTools } from '@tools'
import {
  bookmarksResponseSchema,
  schemasResponseSchema,
  type DirectusApiSchemasResponse,
  type DirectusApiBookmarksResponse,
  type DirectusApi,
  type GroupsMap,
  type SchemasMap,
} from '@services'
import type { EnvConfig } from '@env'


const GROUP_FILENAME = 'group.json'
const COLLECTION_FILENAME = 'collection.json'
const META_FILENAME = 'meta.json'

const DIRECTUS_COLLECTION_NAME = 'directus'
const FIELDS_DIR_NAME = 'fields'
const RELATIONS_DIR_NAME = 'relations'
const BOOKMARKS_DIR_NAME = 'bookmarks'


export async function retrieveSchemas(env: EnvConfig, directusApi: DirectusApi): Promise<GroupsMap> {
  const folderPath = join(env.paths.src, 'schemas')
  const apiSchemasData = await directusApi.getData('/schema/snapshot')
  const resultSchemas = schemasResponseSchema.safeParse(apiSchemasData)

  if (!resultSchemas.success) {
    throw resultSchemas.error
  }
  const apiBookmarksData = await directusApi.getData('/presets?limit=-1')
  const resultBookmarks = bookmarksResponseSchema.safeParse(apiBookmarksData)

  if (!resultBookmarks.success) {
    throw resultBookmarks.error
  }

  await FileSystemTools.clearDir(folderPath)

  const groupsMap: GroupsMap = new Map()
  groupsMap.set(DIRECTUS_COLLECTION_NAME, new Map())

  const schemasMap: SchemasMap = new Map()
  const schemasData = resultSchemas.data

  // Escritura de archivos
  writeGroups(groupsMap, schemasData, folderPath)
  writeCollections(schemasMap, schemasData, folderPath)
  writeFields(schemasMap, schemasData, folderPath)
  writeRelations(schemasMap, schemasData, folderPath)
  writeBookmarks(schemasMap, resultBookmarks.data, folderPath)

  return groupSchemas(schemasMap)
}


function safeName(s: string | null): string {
  return FileSystemTools.safeName(s ?? '', {
    allowedChars: 'a-z0-9_\\s',
    notAllowedCharsReplacer: '_',
    defaultName: 'default',
    replaceDiacritics: true,
    spacesReplacer: '_',
    replaceSpaces: true,
  })
}


function writeGroups(map: GroupsMap, data: DirectusApiSchemasResponse, folderPath: string): void {
  const {
    collections,
    fields,
    relations,
    ...meta
  } = data.data

  FileSystemTools.writeJsonSync(join(folderPath, META_FILENAME), meta)

  collections
    .filter((item) => item.meta.group === null)
    .forEach((item) => {
      const groupName = safeName(item.collection)

      map.set(groupName, new Map())

      FileSystemTools.writeJsonSync(join(folderPath, groupName, GROUP_FILENAME), item)
    })
}


function writeCollections(map: SchemasMap, data: DirectusApiSchemasResponse, folderPath: string): void {
  data
    .data
    .collections
    .filter((item) => item.meta.group !== null)
    .forEach((item) => {
      const collectionName = safeName(item.collection)
      const groupName = safeName(item.meta.group)

      map.set(collectionName, {
        group: groupName,
        collection: collectionName,
        bookmarks: [],
        fields: [],
        relations: [],
      })

      FileSystemTools.writeJsonSync(join(
        folderPath,
        groupName,
        collectionName,
        COLLECTION_FILENAME,
      ), item)
    })
}


function writeFields(schemasMap: SchemasMap, data: DirectusApiSchemasResponse, folderPath: string): void {
  data
    .data
    .fields
    .forEach((item) => {
      const collectionName = safeName(item.collection)
      const schemaMap = schemasMap.get(collectionName)

      if (!schemaMap) {
        return
      }

      const fieldName = safeName(item.field)
      const groupName = safeName(schemaMap.group)

      schemaMap.fields.push(item)
      schemasMap.set(collectionName, schemaMap)

      FileSystemTools.writeJsonSync(join(
        folderPath,
        groupName,
        collectionName,
        FIELDS_DIR_NAME,
        `${fieldName}.json`,
      ), item)
    })
}


function writeRelations(schemasMap: SchemasMap, data: DirectusApiSchemasResponse, folderPath: string): void {
  data
    .data
    .relations
    .forEach((item) => {
      const collectionName = safeName(item.collection)
      const schemaMap = schemasMap.get(collectionName)

      if (!schemaMap) {
        return
      }

      const fieldName = safeName(item.field)
      const relatedCollectionName = safeName(item.related_collection)
      const groupName = safeName(schemasMap.get(collectionName)?.group ?? null)

      schemaMap.relations.push(item)
      schemasMap.set(collectionName, schemaMap)

      FileSystemTools.writeJsonSync(join(
        folderPath,
        groupName,
        collectionName,
        RELATIONS_DIR_NAME,
        `${fieldName}__${relatedCollectionName}.json`,
      ), item)
    })
}


function writeBookmarks(schemasMap: SchemasMap,
  data: DirectusApiBookmarksResponse,
  folderPath: string): void {
  data
    .data
    .forEach((item) => {
      const { user, role, ...cleanItem } = item

      // Evitar personalizados por usuario o rol
      if (user !== null || role !== null) {
        return
      }

      const collectionName = safeName(item.collection)
      const isDirectusBookmark = collectionName.startsWith('directus_')
      const bookmarkName = safeName(item.bookmark?.toLocaleLowerCase() ?? null)
      const groupName = isDirectusBookmark ? DIRECTUS_COLLECTION_NAME : safeName(schemasMap.get(collectionName)?.group ?? null)

      let schemaMap = schemasMap.get(collectionName)

      if (!schemaMap) {
        schemaMap = {
          group: groupName,
          collection: collectionName,
          bookmarks: [],
          fields: [],
          relations: [],
        }
      }

      schemaMap.bookmarks.push(item)
      schemasMap.set(collectionName, schemaMap)

      FileSystemTools.writeJsonSync(join(
        folderPath,
        groupName,
        collectionName,
        BOOKMARKS_DIR_NAME,
        `${bookmarkName}.json`,
      ), cleanItem)
    })
}


function groupSchemas(schemas: SchemasMap): GroupsMap {
  const groupMap: GroupsMap = new Map()

  for (const [schemaName, schema] of schemas) {
    const groupName = schema.group

    if (!groupMap.has(groupName)) {
      groupMap.set(groupName, new Map())
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    groupMap.get(groupName)!.set(schemaName, schema)
  }

  return groupMap
}
