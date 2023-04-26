import { GetIP } from '@wailsjs/go/main/App'

export async function resolveIP() {
  return inWails ? await GetIP() : ''
}

export { GetIPs } from '@wailsjs/go/main/App'
