export const resolveWSURL = (ip: string): string => `ws://${ip||window.location.hostname}:1122/api/v1/WS`
