import { nanoid } from 'nanoid'
import { ParallelHasher } from 'ts-md5'
import hashWorkerJs from 'ts-md5/dist/md5_worker?url'
import axios from 'axios'
import { BASE_URL, USRID } from '@/const'
import { Message } from '@/types'

export const genMsgId = () => nanoid(10)

let hashWorker: ParallelHasher | null = null
export const hasher = async (file: Blob) => {
  if(hashWorker === null) {
    hashWorker = new ParallelHasher(hashWorkerJs)
  }

  return await hashWorker.hash(file) as string
}

export const genFilePath = (file: string): string => `http://${BASE_URL}/api/File/${file}`

export const genTextMsg = (value: string): Message => {
  return {
    id: genMsgId(),
    sender: USRID,
    type: 'text',
    value,
  }
}

export const genFileMsg = ({ file, fileType, tip }: { file: string, fileType: string, tip: string }): Message => {
  return {
    id: genMsgId(),
    sender: USRID,
    type: 'file',
    value: file,
    fileType,
    tip,
  }
}

export const genSvgQrPath = (modules: boolean[][], thinkness: number = 0): string => {
  const ops: string[] = []
  modules.forEach((row, y) => {
    let start: number | null = null
    row.forEach((cell, x) => {
      if (!cell && start !== null) {
        // M0 0h7v1H0z injects the space with the move and drops the comma,
        // saving a char per operation
        ops.push(
          `M${start + thinkness} ${y + thinkness}h${x - start}v1H${start + thinkness}z`
        )
        start = null
        return
      }

      // end of row, clean up or skip
      if (x === row.length - 1) {
        if (!cell) {
          // We would have closed the op above already so this can only mean
          // 2+ light modules in a row.
          return
        }
        if (start === null) {
          // Just a single dark module.
          ops.push(`M${x + thinkness},${y + thinkness} h1v1H${x + thinkness}z`)
        } else {
          // Otherwise finish the current line.
          ops.push(
            `M${start + thinkness},${y + thinkness} h${x + 1 - start}v1H${
              start + thinkness
            }z`
          )
        }
        return
      }

      if (cell && start === null) {
        start = x
      }
    })
  })
  return ops.join('')
}

const http = axios.create({
  baseURL: `http://${BASE_URL}/api`,
})

export const checkFile = async (paylod: { hash: string, fileName:string }) => {
  const res = await http.get<{ exist: boolean, file: string, chunks: number[] }>('/CheckFile', {
    params: paylod,
  })

  return res.data
}

export const uploadFile = async (paylod: FormData) => {
  const res = await http.post<{ file: string }>('/File', paylod)

  return res.data
}

export const mergeFile = async (paylod: { hash: string, fileName: string }) => {
  const res = await http.post<{ file: string }>('/MergeFile', paylod)
  
  return res.data
}
