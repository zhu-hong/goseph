import { nanoid, customAlphabet } from 'nanoid'
import { ParallelHasher } from 'ts-md5'
import hashWorkerJs from 'ts-md5/dist/md5_worker?url'

export const resolveBaseUrl = (): string => `${inWails ? 'localhost' : location.hostname}:1122`

export const generateMsgId = () => nanoid(10)

export const usrid = customAlphabet('0123456789', 10)()

let hashWorker: ParallelHasher | null = null
export const hasher = async (file: File) => {
  if(hashWorker === null) {
    hashWorker = new ParallelHasher(hashWorkerJs)
  }

  return await hashWorker.hash(file)
}
  
