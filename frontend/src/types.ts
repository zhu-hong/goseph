export enum WebSocketState {
  Connecting,
  Open,
  Close,
}

export interface Message {
  type: 'text' | 'file';
  value: string;
}
