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


export type DirectusApiSettings = z.infer<typeof settingsSchema>
