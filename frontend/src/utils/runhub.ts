type Task<T = any> = (() => Promise<T>) | (() => T)

export const createRunhub = (concurrency = 5) => {
  const tasks: Array<Task> = []
  let running: Array<Task> = []

  function enqueue(task: Task) {
    if(typeof task !== 'function') return

    tasks.push(task)

    next()
  }

  function next() {
    // 正是最大运行数/没有等待中的任务
    if(running.length === concurrency || (tasks.length === 0)) return

    while(running.length < concurrency && tasks.length > 0) {
      const func = tasks.shift()!
      running.push(func)
      const res = func()

      if(res instanceof Promise) {
        res.finally(() => {
          running.splice(running.findIndex((f) => f === func) , 1)
          next()
        })
      } else {
        running.splice(running.findIndex((f) => f === func) , 1)
        next()
      }
    }
  }

  return enqueue
}
