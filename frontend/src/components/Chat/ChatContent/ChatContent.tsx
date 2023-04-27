import React, { useEffect, useState } from "react";
import "./ChatContent.scss";

export default function ChatContent(props: any) {
  const { file } = props;
  return (
    <div>
      <span>选择的文件:{file}</span>
    </div>
  );
}
