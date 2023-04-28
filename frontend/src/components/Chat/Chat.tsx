import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { GetIP } from "@wailsjs/go/main/App";
import axios from "axios";
import "./Chat.scss";
import ChatContent from "./ChatContent/ChatContent";
import { Button } from "antd";
import { resolveWSURL } from "../../ws";
import { ChatInput } from "../../components/ChatInput";
import { Message, WebSocketState } from "../../types";
import { ChatArea } from "../../components/ChatArea";

let ws: WebSocket | null = null;

export default function Chat() {
  const [sboxClass, setSBoxClass] = useState("setting-box-none"); //设置弹出盒子是否显示
  const [zdclass, setZdClass] = useState("zidan-img"); //子弹class
  const [ip, setIP] = useState(""); //ip
  const [file, setFile] = useState("未选择"); //选择的文件
  const [mainClass, setMClass] = useState("chat-main"); //底部背景色
  const [content, setContent] = useState("chat-content"); //聊天盒子背景色
  const [wsState, setWsState] = useState(WebSocketState.Connecting);
  const [planeBoxMoveClass, setPlaneBoxMoveClass] = useState("plane-box-move");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    initWS();

    return () => {
      ws!.removeEventListener("open", onOpen);
      ws!.removeEventListener("close", onClose);
      ws!.removeEventListener("message", onMessage);
    };
  }, []);

  /*
  发送消息
*/
  const onMessage = (e: MessageEvent) =>
    setMessages((messages) => [...messages, JSON.parse(e.data)]);

  const onOpen = () => setWsState(WebSocketState.Open);
  const onClose = () => {
    setWsState(WebSocketState.Close);
  };
  async function initWS(ip = "") {
    ws = new WebSocket(resolveWSURL(ip));
    ws.addEventListener("open", onOpen);
    ws.addEventListener("close", onClose);
    ws.addEventListener("message", onMessage);
  }
  function onSend(message: Message) {
    if (wsState !== WebSocketState.Open) return;
    ws?.send(JSON.stringify(message));
  }

  // class主题切换
  function themeChange() {
    setMClass(mainClass === "chat-main" ? "chat-mian-black" : "chat-main");
    setContent(
      content === "chat-content" ? "chat-content-black" : "chat-content"
    );
    setSBoxClass(
      sboxClass === "setting-box-block"
        ? "setting-box-bblack"
        : "setting-box-block"
    );
  }
  // 改变子弹的className
  function changeClass() {
    setZdClass("zidan-img-move");
    setTimeout(() => {
      setZdClass("zidan-img");
    }, 300);
    const filedom = document.getElementById("file");
    filedom.click();
  }
  //选择文件框框
  async function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fm = new FormData();
    fm.append("fileName", file.name);
    fm.append("isFrag", file.name);
    fm.append("file", file);
    setFile(file.name);
    if (window.wails === undefined) {
      axios.post(`http://${file.type}:1122/api/v1/upload`, fm);
    } else {
      const curip = await GetIP();
      axios.post(`http://${curip}:1122/api/v1/upload`, fm);
    }
  }
  //点击左边火箭显示input
  function showInput() {
    // if (window.wails === undefined) return alert("not inWails");
    // const tip = await GetIP();
    // setIP(tip);
    setZdClass("zd-none");
    setPlaneBoxMoveClass("plane-box-input-animation");
  }
  //点击左边火箭显示飞机
  function showPlane() {
    // if (window.wails === undefined) return alert("not inWails");
    // const tip = await GetIP();
    // setIP(tip);
    setPlaneBoxMoveClass("plane-box-plane-animation");
    setTimeout(() => {
      setZdClass("zidan-img");
    }, 500);
  }

  return (
    <div className={mainClass}>
      <div
        className="triggle-img"
        onClick={() => {
          setSBoxClass(
            sboxClass === "setting-box-block" ||
              sboxClass === "setting-box-bblack"
              ? "setting-box-none"
              : sboxClass === "setting-box-none" &&
                mainClass === "chat-mian-black"
              ? "setting-box-bblack"
              : "setting-box-block"
          );
        }}
      ></div>
      <div className="joker-img"></div>
      <div className="yanjing-img"></div>
      <div className="youxiji-img"></div>
      <div className="liwu-img"></div>
      <div className="huanglian-img"></div>
      <div className="lvlian-img"></div>
      <div className={sboxClass}>
        <div className="setting-box-close">
          <div
            onClick={() => {
              setSBoxClass("setting-box-none");
            }}
            className="img"
          ></div>
        </div>
        <Button onClick={themeChange}>切换主题色</Button>
      </div>
      <div className={content}>
        {/* 飞机一直移动 */}
        <div className="plane-move1"></div>
        <div className="plane-move2"></div>
        <div className="plane-move3"></div>
        <div className="chat-dialog">
          {/* 聊天框 */}
          <div className="chat-chat">
            <ChatContent file={file} />
            <ChatArea messages={messages} />
          </div>
          {/* 底部飞机按钮,选择文件 */}
          <div className="bottom-btn">
            <div className="pre-btn" onClick={showInput}></div>
            {/* 子弹 */}
            <div className={zdclass}></div>
            {/* 飞机 */}
            <div className="plane-box">
              <div className={planeBoxMoveClass}>
                <div onClick={changeClass} className="plane1-img">
                  <input
                    id="file"
                    title="react"
                    type="file"
                    multiple
                    onChange={onInputChange}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="chat-input">
                  <ChatInput onSend={onSend} wsState={wsState} />
                </div>
              </div>
            </div>
            <div className="next-btn" onClick={showPlane}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
