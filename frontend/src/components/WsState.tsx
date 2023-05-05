import { WebSocketState } from "@/types"
import { FC } from "react"

export const WsState: FC<{ wsState: WebSocketState, onReconnect: () => void }> = ({ wsState, onReconnect }) => {
  function resolveStateComponent(state: WebSocketState) {
    if(state === WebSocketState.Open) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" className='text-green-400'><mask id="ipSCorrect0"><path fill="#fff" fillRule="evenodd" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m4 24l5-5l10 10L39 9l5 5l-25 25L4 24Z" clipRule="evenodd"></path></mask><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSCorrect0)"></path></svg>
    } else if (state === WebSocketState.Close) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" className='text-red-400 cursor-pointer'><path d="M437.5 386.6L306.9 256l130.6-130.6c14.1-14.1 14.1-36.8 0-50.9-14.1-14.1-36.8-14.1-50.9 0L256 205.1 125.4 74.5c-14.1-14.1-36.8-14.1-50.9 0-14.1 14.1-14.1 36.8 0 50.9L205.1 256 74.5 386.6c-14.1 14.1-14.1 36.8 0 50.9 14.1 14.1 36.8 14.1 50.9 0L256 306.9l130.6 130.6c14.1 14.1 36.8 14.1 50.9 0 14-14.1 14-36.9 0-50.9z" fill="currentColor"></path></svg>
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
    className='absolute top-0 right-0 p-2'
    title={['正在连接websocket','websocket已连接','websocket连接已断开'][wsState]}
    onClick={() => onWsStateClick(wsState)}
  >
    {resolveStateComponent(wsState)}
  </div>
}
