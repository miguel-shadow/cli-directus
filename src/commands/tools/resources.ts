export const RESOURCES = [
  'settings',
  'schemas',
  'flows',
  'folders',
  'dashboards',
  'policies',
] as const

export type Resource = (typeof RESOURCES)[number]


export const resourcesTools = {
  isResource,
}

function isResource(value: string): value is Resource {
  return RESOURCES.some((resource) => resource === value)
}
