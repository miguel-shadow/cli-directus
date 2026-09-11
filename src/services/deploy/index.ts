import { deployFolders } from './folders.js'
import { deploySchemas } from './schemas.js'
import { deploySettings } from './settings.js'


export const DirectusDeploy = {
  settings: deploySettings,
  schemas: deploySchemas,
  folders: deployFolders,
}
