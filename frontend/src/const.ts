import { customAlphabet } from 'nanoid'

export const BASE_URL = `${inWails ? 'localhost' : location.hostname}:12138`

export const USRID = customAlphabet('0123456789', 6)()

export const CHUNK_SIZE = 1024 * 1024 * 24
