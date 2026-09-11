import { retrieveFolders } from './folders.js'
import { retrieveSchemas } from './schemas.js'
import { retrieveSettings } from './settings.js'


export const DirectusRetrieve = {
  settings: retrieveSettings,
  schemas: retrieveSchemas,
  folders: retrieveFolders,
}
