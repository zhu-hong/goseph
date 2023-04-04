# goseph（局域网传输数据）

## 涉及的技术

+ wails（golang桌面应用打包工具）
+ gin（http服务）
  + 代理前端静态资源，wailsapp启动后，局域网内手机端浏览器打开也能使用
  + 支持并发下载
+ websocket（websocket服务）
  + 像聊天一样发送文字，文件数据
+ react&ts（前端界面）
  + 大文件分片上传
