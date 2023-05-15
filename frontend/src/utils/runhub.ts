type Task<TReturn = any> = (() => Promise<TReturn>) | (() => TReturn)

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
    if(running.length === concurrency) {
      console.log('达到最大运行')
      return
    }
    if(tasks.length === 0) {
      console.log('没有等待中的任务')
      return
    }

    while(running.length < concurrency && tasks.length > 0) {
      const func = tasks.shift()!
      running.push(func)
      console.log('添加一个任务', `${running.length}个任务正在运行`, `${tasks.length}个任务正在等待`)

      const res = func()

      if(res instanceof Promise) {
        res.finally(() => {
          running.splice(running.findIndex((f) => f === func) , 1)
          console.log('一个任务完成', `还剩${running.length}个任务`)
          next()
        })
      } else {
        running.splice(running.findIndex((f) => f === func) , 1)
        console.log('一个任务完成', `还剩${running.length}个任务`)
        next()
      }
    }
  }

  return enqueue
}
