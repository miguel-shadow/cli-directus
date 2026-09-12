import type {
  DirectusApiBookmark,
  DirectusApiField,
  DirectusApiRelation,
  DirectusApiCollection,
  DirectusApiSchemaDiff,
  DirectusApiFolder,
  DirectusApiDashboard,
  DirectusApiFlow,
  DirectusApiPolicy,
} from './schemas.js'


interface SchemaStructure {
  bookmarks: DirectusApiBookmark[]
  collection: string
  fields: DirectusApiField[]
  group: string
  relations: DirectusApiRelation[]
}

export type GroupsMap = Map<string, SchemasMap>
export type SchemasMap = Map<string, SchemaStructure>


export interface SchemaResume {
  collections: DirectusApiSchemaDiff['diff']['collections']
  fields: DirectusApiSchemaDiff['diff']['fields']
  relations: DirectusApiSchemaDiff['diff']['relations']
}

export interface BookmarksResume {
  existing: DirectusApiBookmark[]
  new: DirectusApiBookmark[]
}

export interface SchemaDeployResume {
  bookmarksResume: BookmarksResume
  schemaResume: SchemaResume
}

export interface SchemasSrcData {
  bookmarks: DirectusApiBookmark[]
  schema: {
    collections: DirectusApiCollection[]
    fields: DirectusApiField[]
    relations: DirectusApiRelation[]
  }
}
export interface DashboardsResume {
  existing: DirectusApiDashboard[]
  new: DirectusApiDashboard[]
}


export interface FlowsResume {
  existing: DirectusApiFlow[]
  new: DirectusApiFlow[]
}


export interface PoliciesResume {
  existing: DirectusApiPolicy[]
  new: DirectusApiPolicy[]
}


export interface FoldersResume {
  existing: DirectusApiFolder[]
  new: DirectusApiFolder[]
}

export interface FolderTree {
  folder: DirectusApiFolder
  hasChildrens: boolean
  id: string
  name: string
  path: string
}
