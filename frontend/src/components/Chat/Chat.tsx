import React, { useState, useRef, useEffect } from "react";
import "./Chat.scss";
import { Button } from "antd";

export function Chat() {
  const [isSetBox, setIsSetBox] = useState(false);
  const setbox: any = useRef();

  return (
    <div className="chat-main">
      <div
        className="triggle-img"
        onClick={() => {
          setIsSetBox(!isSetBox);
        }}
      ></div>
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
      <div className="chat-content"></div>
    </div>
  );
}
