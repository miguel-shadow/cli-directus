import { deployDashboards } from './dashboards.js'
import { deployFolders } from './folders.js'
import { deploySchemas } from './schemas.js'
import { deploySettings } from './settings.js'
import { deployFlows } from './flows.js'


export const DirectusDeploy = {
  settings: deploySettings,
  schemas: deploySchemas,
  folders: deployFolders,
  dashboards: deployDashboards,
  flows: deployFlows,
}
