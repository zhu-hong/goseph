import { GetIP } from "@wailsjs/go/main/App"
import { ChangeEvent, useState } from "react"

export function FileInput() {
  const [ip, setIP] = useState('')

  async function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]

    if(!file) return
    
    console.log(file)

    const fr = new FileReader()

    fr.readAsText(file)

    fr.addEventListener('load', (e) => {
      console.log(e.target?.result)
    })
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