export enum WebSocketState {
  Connecting,
  Open,
  Close,
}

export enum FileState {
  HASHING,
  UPLOADING,
  MERGEING,
  SUCCESS,
  ERROR,
}

export interface Message {
  id: string
  sender: string;
  type: 'text' | 'file'
  value: string

  /**
   * 文件消息特有
  */
  fileType?: string
  /**
   * 文件名或错误信息
  */
  tip?: string
}

export enum TaskState {
  HASHING,
  UPLOADING,
  MERGEING,
  SUCCESS,
  FAIL,
}

export interface Task {
  id: string
  name?: string
  state?: TaskState
  size?: number
  progress?: number
  fileType?: string
  retry?: () => void
  cancel?: () => void
}
