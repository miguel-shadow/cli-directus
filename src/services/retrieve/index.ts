import { retrieveDashboards } from './dashboards.js'
import { retrieveFolders } from './folders.js'
import { retrieveSchemas } from './schemas.js'
import { retrieveSettings } from './settings.js'
import { retrieveFlows } from './flows.js'
import { retrievePolicies } from './policies.js'


export const DirectusRetrieve = {
  settings: retrieveSettings,
  schemas: retrieveSchemas,
  folders: retrieveFolders,
  dashboards: retrieveDashboards,
  flows: retrieveFlows,
  policies: retrievePolicies,
}
