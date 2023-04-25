import React, { useState, useRef, useEffect } from "react";
import "./Chat.scss";
import { Button } from "antd";

export default function Chat() {
  const [isSetBox, setIsSetBox] = useState(false);
  const [zdclass, setZdClass] = useState("zidan-img");
  const setbox: any = useRef();
  function changeClass() {
    setZdClass("zidan-img-move");
    setTimeout(() => {
      setZdClass("zidan-img");
    }, 300);
  }
  return (
    <div className="chat-main">
      <div
        className="triggle-img"
        onClick={() => {
          setIsSetBox(!isSetBox);
        }}
      ></div>
      <div className="joker-img"></div>
      <div className="yanjing-img"></div>
      <div className="youxiji-img"></div>
      <div className="liwu-img"></div>
      <div className="huanglian-img"></div>
      <div className="lvlian-img"></div>
      <div
        ref={setbox}
        className={isSetBox ? "setting-box-block" : "setting-box-none"}
      >
        <div className="setting-box-close">
          <div
            onClick={() => {
              setIsSetBox(false);
            }}
            className="img"
          ></div>
        </div>
        <Button>setting</Button>
      </div>
      <div className="chat-content">
        {/* 飞机一直移动 */}
        <div className="plane-move1"></div>
        <div className="plane-move2"></div>
        <div className="plane-move3"></div>
        <div className="chat-dialog">
          {/* 聊天框 */}
          <div className="chat-chat"></div>
          {/* 底部飞机按钮,选择文件 */}
          <div className="bottom-btn">
            <div className="pre-btn"></div>
            {/* 子弹 */}
            <div className={zdclass}></div>
            {/* 飞机 */}
            <div className="plane-box">
              <div onClick={changeClass} className="plane1-img"></div>
            </div>
            <div className="next-btn"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
