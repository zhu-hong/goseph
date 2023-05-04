import { nanoid, customAlphabet } from 'nanoid'
import { ParallelHasher } from 'ts-md5'
import hashWorkerJs from 'ts-md5/dist/md5_worker?url'

const hashWorker = new ParallelHasher(hashWorkerJs)

export const resolveWSURL = (): string => `ws://${window.location.hostname}:1122/api/v1/WS`

export const generateMsgId = () => nanoid(10)

export const usrid = customAlphabet('0123456789', 10)()

export const hasher = async (file: File) => await hashWorker.hash(file)
