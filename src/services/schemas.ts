import z from 'zod'


export const settingsSchema = z.object({
  id: z.number(),
  project_name: z.string(),
  project_url: z.string(),
  project_descriptor: z.string(),
  project_id: z.string(),
  project_owner: z.string(),
}).catchall(z.unknown())

export const settingsResponseSchema = z.object({
  data: settingsSchema,
})


export const bookmarkSchema = z.object({
  id: z.number(),
  bookmark: z.string().nullable(),
  collection: z.string(),
}).catchall(z.unknown())

export const bookmarksResponseSchema = z.object({
  data: z.array(bookmarkSchema),
})


export const collectionSchema = z.object({
  collection: z.string(),
  meta: z.object({
    group: z.string().nullable(),
  }).catchall(z.unknown()),
}).catchall(z.unknown())

export const fieldSchema = z.object({
  collection: z.string(),
  field: z.string(),
}).catchall(z.unknown())

export const relationSchema = z.object({
  collection: z.string(),
  field: z.string(),
  related_collection: z.string(),
}).catchall(z.unknown())

export const schemasResponseSchema = z.object({
  data: z.object({
    collections: z.array(collectionSchema),
    fields: z.array(fieldSchema),
    relations: z.array(relationSchema),
  }).catchall(z.unknown()),
})


export const schemaDiffResponse = z.object({
  data: z.object({
    hash: z.string(),
    diff: z.object({
      collections: z.array(z.object({
        collection: z.string(),
      }).catchall(z.unknown())),
      fields: z.array(z.object({
        collection: z.string(),
        field: z.string(),
      }).catchall(z.unknown())),
      relations: z.array(z.object({
        collection: z.string(),
        field: z.string(),
        related_collection: z.string(),
      }).catchall(z.unknown())),
    }).catchall(z.unknown()),
  }),
}).nullable()


export const schemaDiff = z.object({
  hash: z.string(),
  diff: z.object({
    collections: z.array(z.object({
      collection: z.string(),
    }).catchall(z.unknown())),
    fields: z.array(z.object({
      collection: z.string(),
      field: z.string(),
    }).catchall(z.unknown())),
    relations: z.array(z.object({
      collection: z.string(),
      field: z.string(),
      related_collection: z.string(),
    }).catchall(z.unknown())),
  }).catchall(z.unknown()),
})


export const folderSchema = z.object({
  id: z.string(),
  name: z.string(),
  parent: z.string().nullable(),
}).catchall(z.unknown())

export const foldersResponseSchema = z.object({
  data: z.array(folderSchema),
})


export type DirectusApiSettings = z.infer<typeof settingsSchema>
export type DirectusApiBookmark = z.infer<typeof bookmarkSchema>
export type DirectusApiCollection = z.infer<typeof collectionSchema>
export type DirectusApiField = z.infer<typeof fieldSchema>
export type DirectusApiFolder = z.infer<typeof folderSchema>
export type DirectusApiRelation = z.infer<typeof relationSchema>
export type DirectusApiSchemasResponse = z.infer<typeof schemasResponseSchema>
export type DirectusApiBookmarksResponse = z.infer<typeof bookmarksResponseSchema>
export type DirectusApiFoldersResponse = z.infer<typeof foldersResponseSchema>
export type DirectusApiSchemaDiff = z.infer<typeof schemaDiff>
