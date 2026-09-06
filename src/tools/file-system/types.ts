export interface GetFilesOptions {
  recursive?: boolean
}

export interface RenameOptions {
  override?: boolean
  silentError?: boolean
}

export interface SafeNameOptions {
  allowedChars?: SafeNameOptionAllowedChars
  defaultName?: string
  maxLength?: number
  replaceDiacritics?: boolean
  replaceSpaces?: boolean
}

type SafeNameOptionAllowedChars = string | SafeNameOptionsAllowedCharsObject

interface SafeNameOptionsAllowedCharsObject {
  allow: string
  flags: string
}

export interface WriteFileOptions {
  append?: boolean
  override?: boolean
  silentError?: boolean
}

export interface WriteJsonOptions {
  override?: boolean
  pretty?: boolean
  silentError?: boolean
}
