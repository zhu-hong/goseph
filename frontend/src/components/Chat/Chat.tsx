import React, { useState, ChangeEvent, useRef } from "react";
import { GetIP } from "@wailsjs/go/main/App";
import axios from "axios";
import "./Chat.scss";
import ChatContent from "./ChatContent/Chatcontent";
import { Button } from "antd";

export default function Chat() {
  const [sboxClass, setSBoxClass] = useState("setting-box-none"); //设置弹出盒子是否显示
  const [zdclass, setZdClass] = useState("zidan-img"); //子弹class
  const [ip, setIP] = useState(""); //ip
  const [file, setFile] = useState("未选择"); //选择的文件
  const [mainClass, setMClass] = useState("chat-main"); //底部背景色
  const [content, setContent] = useState("chat-content"); //聊天盒子背景色

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
  }

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
      console.log(curip);
      axios.post(`http://${curip}:1122/api/v1/upload`, fm);
    }
  }

  async function getIp() {
    if (window.wails === undefined) return alert("not inWails");
    const tip = await GetIP();
    setIP(tip);
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
            {/* <input
              title="react"
              type="file"
              multiple
              onChange={onInputChange}
            /> */}

            <span>{ip}</span>
            <ChatContent file={file} />
          </div>
          {/* 底部飞机按钮,选择文件 */}
          <div className="bottom-btn">
            {/* 获取ip按钮 */}
            <div onClick={getIp} className="pre-btn"></div>
            {/* 子弹 */}
            <div className={zdclass}></div>
            {/* 飞机 */}
            <div className="plane-box">
              <div onClick={changeClass} className="plane1-img">
                <input
                  title="react"
                  type="file"
                  multiple
                  onChange={onInputChange}
                  style={{ opacity: 0, position: "relative", bottom: "-50px" }}
                />
              </div>
            </div>
            {/* 一样的获取ip按钮 */}
            <div onClick={getIp} className="next-btn"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
