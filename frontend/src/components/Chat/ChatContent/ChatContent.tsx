import React, { useEffect, useState } from "react";
import "./ChatContent.scss";

export default function ChatContent(props: any) {
  const [arr, setarr] = useState(["aa"]);
  let data = "[123]";
  useEffect(() => {
    setarr([...arr, JSON.parse(data)]);
  }, []);
  console.log(arr);

  const { file } = props;
  return (
    <div>
      <span>选择的文件:{file}</span>
    </div>
  );
}
