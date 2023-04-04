import { GetIP } from "@wailsjs/go/main/App"
import { ChangeEvent, useState } from "react"
import axios from 'axios'

export function FileInput() {
  const [ip, setIP] = useState('')

  async function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]

    if(!file) return

    const fm = new FormData()
    fm.append('fileName', file.name)
    fm.append('isFrag', file.name)
    fm.append('file', file)

    const curip = await GetIP()
    console.log(curip)

    axios.post(`http://${curip}:1122/api/v1/upload`, fm)
  }

  async function getIp() {
    const tip = await GetIP()
    console.log(tip)
    setIP(tip)
  }

  return (
    <div>
      <input title="react" type="file" multiple onChange={onInputChange} />
      <span>{ ip }</span>
      <button onClick={getIp}>getip</button>
    </div>
  )
}