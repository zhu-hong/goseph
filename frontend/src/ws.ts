import { resolveIP } from './utils'

export const resolveWS = async () => {
  const ip = await resolveIP()

  let wsurl = `ws://${ip||window.location.hostname}:1122/api/v1/WS`

  return new WebSocket(wsurl)
}
