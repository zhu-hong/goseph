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

export const generateSvgPath = (modules: boolean[][], thinkness: number = 0): string => {
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
