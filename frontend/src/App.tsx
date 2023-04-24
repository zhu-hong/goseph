import { StrictMode } from "react";
import { FileInput } from "@/components/FileInput";
import { Chat } from "./components/Chat/Chat";
import "./App.scss";

export default function () {
  return (
    <div className="app">
      {/* <StrictMode> */}
      {/* <FileInput /> */}
      <Chat />
      {/* </StrictMode> */}
    </div>
  );
}
