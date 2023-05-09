import { GetIPs, GetMaybeLocalIP } from '@wailsjs/go/main/App'
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import qrcodegen from '@/utils/qrcodegen'
import { generateSvgPath } from '@/utils'
import { CSSTransition } from 'react-transition-group'
import { BrowserOpenURL } from '@wailsjs/runtime/runtime'

export const LocalAddr = () => {
  if(!inWails) return null

  const qrPanelRef = useRef<HTMLDivElement>(null)
  const [ip, setIp] = useState('')
  const [ips, setIps] = useState<string[]>([])
  const [showQr, setShowQr] = useState(false)
  const [svgPath, setSvgPath] = useState('')
  const [qrViewBoxSize, setQrViewBoxSize] = useState(0)

  useEffect(() => {
    GetMaybeLocalIP().then((ip) => {
      setIp(ip)
    })
    GetIPs().then((ips) => {
      setIps(ips)
    })

    function hideQr() {
      setShowQr(false)
    }

    document.body.addEventListener('click', hideQr)

    return () => document.body.removeEventListener('click', hideQr)
  }, [])

  const localAddr = useMemo(() => {
    return `${ip}:12138/z/`
  }, [ip])

  // 更新二维码
  useEffect(() => {
    if(ip.length === 0) return

    const modules = qrcodegen.QrCode.encodeText(localAddr, qrcodegen.QrCode.Ecc.HIGH).getModules()
    setQrViewBoxSize(modules.length+2)
    setSvgPath(generateSvgPath(modules, 1))
  }, [localAddr])

  return <div className="absolute top-0 right-36px w-36px h-36px addr-panel nodrag" onClick={(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation()
  }} >
    <div onClick={() => setShowQr(!showQr)} className="absolute top-0 right-0 p-2 text-xl text-gray-400 cursor-pointer rounded-full transition active:(bg-light dark:bg-dark)" title="手机扫码打开"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M1 1h10v10H1V1zm2 2v6h6V3H3z"></path><path fill="currentColor" fillRule="evenodd" d="M5 5h2v2H5z"></path><path fill="currentColor" d="M13 1h10v10H13V1zm2 2v6h6V3h-6z"></path><path fill="currentColor" fillRule="evenodd" d="M17 5h2v2h-2z"></path><path fill="currentColor" d="M1 13h10v10H1V13zm2 2v6h6v-6H3z"></path><path fill="currentColor" fillRule="evenodd" d="M5 17h2v2H5z"></path><path fill="currentColor" d="M23 19h-4v4h-6V13h1h-1v6h2v2h2v-6h-2v-2h-1h3v2h2v2h2v-4h2v6zm0 2v2h-2v-2h2z"></path></svg></div>

    <CSSTransition nodeRef={qrPanelRef} in={showQr} timeout={250} classNames='qr-panel'>
      <div
        ref={qrPanelRef}
        className='absolute top-full right-0 w-60 p-5 shadow bg-white/50 dark:bg-gray-900/50 rounded backdrop-filter backdrop-blur-sm origin-tr transition duration-300 qr-panel'
      >
        <div className='w-full h-50 rounded overflow-hidden drag'>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-full h-full' viewBox={`0 0 ${qrViewBoxSize} ${qrViewBoxSize}`} shapeRendering="crispEdges">
            <path fill='#fff' d={`M0,0 h${qrViewBoxSize}v${qrViewBoxSize}H0z`}></path>
            <path fill='#000' d={svgPath}></path>
          </svg>
        </div>
        <select value={ip} className='w-full my-4' onChange={(e) => setIp(e.target.value)} title='选择ip'>
          {
            ips.map((ip) => <option key={ip} value={ip}>{ip}</option>)
          }
        </select>
        <span onClick={() => BrowserOpenURL(`http://${localAddr}`)} className='text-rose-400 cursor-pointer underline'>{localAddr}</span>
      </div>
    </CSSTransition>
  </div>
}
