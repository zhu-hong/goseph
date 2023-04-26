import { ChatBox } from "./components/ChatBox";

export function App() {
  return <div className="max-w-640px h-full overflow-hidden flex flex-col mx-auto pb-4 px-4 lt-sm:pb-2 lt-sm:px-2">
    <div className="flex-auto overflow-auto"></div>
    <ChatBox />
  </div>
}