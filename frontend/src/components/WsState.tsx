import { WebSocketState } from "@/types"
import { FC } from "react"

export const WsState: FC<{ wsState: WebSocketState, onReconnect: () => void }> = ({ wsState, onReconnect }) => {
  function resolveStateComponent(state: WebSocketState) {
    if(state === WebSocketState.Open) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" className='text-green-400'><mask id="ipSCorrect0"><path fill="#fff" fillRule="evenodd" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m4 24l5-5l10 10L39 9l5 5l-25 25L4 24Z" clipRule="evenodd"></path></mask><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSCorrect0)"></path></svg>
    } else if (state === WebSocketState.Close) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 128 128" className='text-red-400 cursor-pointer'><path fill="currentColor" d="M55.57 74.05h16.87c.61 0 1.13-.41 1.16-.92l4.6-66.16c.02-.27-.1-.53-.32-.72c-.22-.2-.52-.31-.84-.31H50.96c-.32 0-.62.11-.84.31c-.21.19-.33.46-.31.72l4.6 66.16c.03.51.54.92 1.16.92zm-5.22 34.78c0-2.44.35-4.5 1.05-6.19c.7-1.69 1.67-3.05 2.92-4.08c1.24-1.04 2.71-1.79 4.4-2.26c1.68-.46 3.48-.7 5.41-.7c1.82 0 3.54.24 5.18.7c1.63.47 3.07 1.22 4.32 2.26c1.24 1.03 2.23 2.39 2.96 4.08s1.09 3.75 1.09 6.19c0 2.33-.36 4.32-1.09 5.98c-.73 1.67-1.71 3.04-2.96 4.13c-1.25 1.09-2.68 1.87-4.32 2.37c-1.64.49-3.36.74-5.18.74c-1.92 0-3.72-.25-5.41-.74c-1.69-.5-3.16-1.29-4.4-2.37c-1.24-1.1-2.22-2.46-2.92-4.13c-.7-1.65-1.05-3.65-1.05-5.98z"></path></svg>
    } else {
      return <svg width="1em" height="1em" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className='text-yellow-400 animate-spin'>
        <circle cx="200" cy="200" r="150" strokeWidth="50" fill='transparent' stroke="currentColor" transform="matrix(0,-1,1,0,0,400)" strokeDasharray="400 1069"></circle>
      </svg>
    }
  }
  function onWsStateClick(state: WebSocketState) {
    if(state !== WebSocketState.Close) return

    onReconnect()
  }
  return <div
    className='absolute top-0 right-0 p-2 hover:opacity-80 transition text-xl'
    title={['websocket connecting🎯','websocket connected✅','websocket disconnected💣click to retry connect'][wsState]}
    onClick={() => onWsStateClick(wsState)}
  >
    {resolveStateComponent(wsState)}
  </div>
}
