import { ZodTools } from '@tools'
import z from 'zod'


export const ENV_DATA_DEFAULT_VALUES = {
  project: {
    name: 'Directus',
    description: 'Directus',
    id: () => crypto.randomUUID(),
    ownerEmail: 'default@test.com',
  },
} as const


export const directusEnvDataProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .default(ENV_DATA_DEFAULT_VALUES.project.name),
  description: z
    .string()
    .trim()
    .min(1)
    .default(ENV_DATA_DEFAULT_VALUES.project.description),
  ownerEmail: z
    .email()
    .trim()
    .default(ENV_DATA_DEFAULT_VALUES.project.ownerEmail),
  id: z.uuid().default(ENV_DATA_DEFAULT_VALUES.project.id()),
}).default({
  name: ENV_DATA_DEFAULT_VALUES.project.name,
  description: ENV_DATA_DEFAULT_VALUES.project.description,
  id: ENV_DATA_DEFAULT_VALUES.project.id(),
  ownerEmail: ENV_DATA_DEFAULT_VALUES.project.ownerEmail,
})

export const directusEnvDataSchema = z.object({
  alias: z
    .string(ZodTools.MESSAGES.STRING_TYPE)
    .trim()
    .min(1)
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, 'El alias solo puede contener letras minúsculas, números, guiones y guiones bajos.'),
  email: z.email().trim(),
  token: z
    .string()
    .trim(),
  url: z.url(ZodTools.MESSAGES.URL_TYPE).trim(),
  project: directusEnvDataProjectSchema,
})

export const directusEnvDataArraySchema = z.array(directusEnvDataSchema)


export type DirectusEnvData = z.infer<typeof directusEnvDataSchema>
export type DirectusEnvDataProject = z.infer<typeof directusEnvDataProjectSchema>
