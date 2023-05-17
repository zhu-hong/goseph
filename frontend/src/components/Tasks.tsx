import { useTaskStore } from '@/store'
import { TaskState } from '@/types'
import { buildFileIcon, formatFileSize } from '@/utils'
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

function getTaskDesc(state: TaskState): string {
  return {
    [TaskState.HASHING]: '读取中',
    [TaskState.UPLOADING]: '上传中',
    [TaskState.MERGEING]: '合并中',
    [TaskState.SUCCESS]: '上传成功',
    [TaskState.FAIL]: '上传失败，点击重试',
  }[state]
}

export const Tasks = () => {
  const panelRef = useRef<HTMLDivElement>(null)
  const [showPanel, setShowPanel] = useState(false)

  const tasks = useTaskStore((state) => state.tasks)
  
  useEffect(() => {
    function hiddenPanel() {
      setShowPanel(false)
    }
    document.body.addEventListener('click', hiddenPanel)

    return () => {
      document.body.removeEventListener('click', hiddenPanel)
    }
  }, [])

  const tasksDetail = useMemo(() => {
    return tasks.map((task) => {
      return {
        ...task,
        tip: getTaskDesc(task.state!),
        sizeProgress: `${formatFileSize(task.size!*task.progress!/100)} / ${formatFileSize(task.size!)}`
      }
    })
  }, [tasks])

  return <div className="w-36px h-36px outter-panel nodrag relative" onClick={(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation()
  }} >
    <div title="上传任务" onClick={() => {
      document.body.click()
      setShowPanel(!showPanel)
    }} className="absolute top-0 right-0 p-2 text-xl text-gray-400 cursor-pointer rounded-full transition active:(bg-light dark:bg-dark)">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12.414 5H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2ZM13 13h3l-4-4l-4 4h3v4h2v-4Z"></path></svg>
    </div>

    <CSSTransition nodeRef={panelRef} in={showPanel} timeout={250} classNames='inner-panel'>
      <div
        ref={panelRef}
        className='absolute top-full max-h-320px overflow-x-hidden overflow-y-overlay right-0 w-70 shadow bg-white/50 dark:bg-gray-900/50 rounded backdrop-filter backdrop-blur-sm origin-tr transition duration-300 inner-panel'
      >
        {
          tasks.length === 0
          ?
          <div className='text-black dark:text-white text-center p-4'>没有上传任务</div>
          :
          tasksDetail.map((task) => <div key={task.id} className='rounded p-2 overflow-hidden bg-light/80 text-dark/80 dark:(bg-dark text-light)'>
            <div className='text-2xl flex items-center gap-4 mb-1'>
              { buildFileIcon(task.fileType!) }
              <span className='text-base truncate flex-auto' title={task.name}>{task.name}</span>
            </div>
            <div className='relative w-full h-2 bg-gray-300 dark:bg-gray-700 rounded overflow-hidden'>
              <div className='h-full' style={{
                width: `${task.progress!}%`,
                backgroundImage: 'linear-gradient(90deg, #0fbcf9, #34e7e4)',
              }}></div>
            </div>
            <div className='flex items-center mt-2 gap-2'>
              <div className='text-base'>
                {
                  task.state === TaskState.SUCCESS
                  ?
                  <svg xmlns="http://www.w3.org/2000/svg" width="0.96em" height="1em" viewBox="0 0 256 268"><path fill="#FF37AD" d="M22.498 68.97a11.845 11.845 0 1 0 0-23.687c-6.471.098-11.666 5.372-11.666 11.844c0 6.472 5.195 11.746 11.666 11.844Zm181.393-10.04a11.845 11.845 0 1 0-.003-23.688c-6.471.098-11.665 5.373-11.665 11.845c.001 6.472 5.197 11.745 11.668 11.842Z"></path><path fill="#FCC954" d="M213.503 211.097a11.845 11.845 0 1 0-.003-23.687c-6.471.098-11.665 5.373-11.664 11.845c0 6.472 5.196 11.745 11.667 11.842ZM70.872 23.689a11.845 11.845 0 1 0 0-23.688C64.4.1 59.206 5.373 59.206 11.845c0 6.472 5.195 11.746 11.666 11.844Z"></path><path fill="#2890E9" d="M140.945 105.94a9.249 9.249 0 0 1-8.974-11.484c.37-1.482.672-2.97.899-4.455a25.404 25.404 0 0 1-8.732 1.904c-5.379.205-10.195-.702-14.3-2.69a22.227 22.227 0 0 1-9.614-8.877c-4.415-7.652-4.034-17.718.964-25.645c4.765-7.568 12.836-11.664 21.586-10.995c6.74.527 12.647 3.051 17.378 7.382c.861-2.43 1.687-5.033 2.473-7.803c4.833-17.058 6.429-34.187 6.442-34.36a9.24 9.24 0 0 1 10.041-8.37a9.248 9.248 0 0 1 8.37 10.044c-.067.767-1.768 19.03-7.068 37.735c-2.676 9.445-5.838 17.426-9.42 23.798c.264 1.42.475 2.878.631 4.372c.746 7.211.152 14.974-1.714 22.445a9.256 9.256 0 0 1-8.962 6.998Zm-20.123-43.827c-.956 0-2.64.28-3.996 2.43c-1.298 2.06-1.552 4.873-.588 6.544c1.282 2.223 5.054 2.417 7.19 2.336c2.424-.092 4.908-1.612 7.338-4.382a16.203 16.203 0 0 0-1.43-2.422c-2.007-2.787-4.547-4.212-7.998-4.482c-.13-.008-.305-.024-.516-.024Z"></path><path fill="#F0A420" d="M114.361 131.268c-38.343-30.224-78.42-43.319-89.514-29.246a12.803 12.803 0 0 0-2.257 4.509a3.967 3.967 0 0 0-.156.61v.024c-.149.632-.26 1.27-.333 1.917L.393 236.18c-3.477 20.412 16.73 36.755 35.967 29.093l117.721-46.908c2.076-.826 7.185-3.982 8.583-5.724c.37-.362.717-.747 1.037-1.153c11.092-14.075-11-49.988-49.34-80.223v.003Z"></path><path fill="#FCC954" d="M163.688 211.494c11.1-14.08-10.984-50-49.327-80.226c-38.343-30.227-78.425-43.316-89.524-29.236c-11.1 14.08 10.983 50 49.326 80.226c38.343 30.227 78.425 43.316 89.525 29.236Z"></path><path fill="#F0A420" d="M156.994 203.294c9.108-11.556-10.956-42.563-44.817-69.256c-33.861-26.695-68.697-38.966-77.804-27.413c-9.11 11.556 10.954 42.563 44.815 69.256c33.86 26.695 68.697 38.969 77.806 27.413Z"></path><path fill="#2E6AC9" d="M76.059 249.456c-14.327.07-26.004-7.101-40.158-18.257C19.431 218.21 8.493 202.665 7.63 193.81l-4.668 27.327c2.16 7.798 9.523 17.683 20.202 26.101c8.883 7.004 17.844 11.813 27.135 12.48l25.76-10.266v.003Zm-14.332-49.6c-27.443-21.637-45.271-46.467-44.77-60.669l-4.549 26.63c.351 12.685 15.175 33.184 36.262 49.808c18.894 14.896 38.583 25.38 53.66 23.363l25.593-10.2c-20.62 1.425-42.376-10.147-66.196-28.931Z"></path><path fill="#2890E9" d="M118.535 145.052a11.845 11.845 0 1 0 0-23.688c-6.471.098-11.666 5.372-11.666 11.844c0 6.472 5.195 11.746 11.666 11.844Z"></path><path fill="#FF37AD" d="m182.412 122.007l.087-.097c.108-.116.308-.33.596-.621a45.36 45.36 0 0 1 2.8-2.56c3.56-2.98 7.45-5.54 11.594-7.63c10.128-5.125 25.208-9.307 44.985-4.747c5.943 1.37 11.87-2.336 13.241-8.278c1.37-5.942-2.336-11.87-8.278-13.24c-25.602-5.903-45.957-.506-59.922 6.566a82.52 82.52 0 0 0-15.857 10.449a65.47 65.47 0 0 0-4.215 3.866a45.348 45.348 0 0 0-1.53 1.615l-.12.135l-.042.048l-.02.022l-.007.008c-.003.005-.009.01 8.361 7.21l-8.37-7.2c-3.877 4.622-3.328 11.5 1.233 15.448c4.561 3.948 11.446 3.506 15.464-.994ZM73.03 43.248a11.748 11.748 0 0 0-16.23-3.664a11.759 11.759 0 0 0-3.665 16.227c.427.683 9.178 14.86 10.976 34.276c1.83 19.727-3.966 37.86-17.253 54.12c4.474 5.686 9.858 11.596 16.008 17.507c8.51-9.834 14.913-20.402 19.12-31.583c5.175-13.756 7.006-28.342 5.445-43.348c-2.487-23.874-12.874-41.11-14.402-43.535Z"></path><path fill="#2890E9" d="M220.242 156.578c6.002 1.553 10.244 3.246 12.077 4.034a11.858 11.858 0 0 0 13.94-1.12a11.867 11.867 0 0 0 4.107-8.765a11.848 11.848 0 0 0-8.06-11.426c-5.618-2.495-26.905-10.92-55.044-9.423c-18.941 1.007-37.155 6.253-54.133 15.608c-16.076 8.86-31.004 21.412-44.556 37.425a198.603 198.603 0 0 0 20.17 12.607c22.882-26.08 49.283-40.217 78.7-42.085a105.86 105.86 0 0 1 32.8 3.145Z"></path></svg>
                  :
                  task.state === TaskState.FAIL
                  ?
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={() => task.retry!()} className='text-red-400 cursor-pointer' width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M7.32.029a8 8 0 0 1 7.18 3.307V1.75a.75.75 0 0 1 1.5 0V6h-4.25a.75.75 0 0 1 0-1.5h1.727A6.5 6.5 0 0 0 1.694 6.424A.75.75 0 1 1 .239 6.06A8 8 0 0 1 7.319.03Zm-3.4 14.852A8 8 0 0 0 15.76 9.94a.75.75 0 0 0-1.455-.364A6.5 6.5 0 0 1 2.523 11.5H4.25a.75.75 0 0 0 0-1.5H0v4.25a.75.75 0 0 0 1.5 0v-1.586a8 8 0 0 0 2.42 2.217Z" clipRule="evenodd"></path></svg>
                  :
                  <svg xmlns="http://www.w3.org/2000/svg" className='text-yellow-400 animate-spin' width="1em" height="1em" viewBox="0 0 24 24"><defs><linearGradient id="mingcuteLoadingFill0" x1="50%" x2="50%" y1="5.271%" y2="91.793%"><stop offset="0%" stopColor="currentColor"></stop><stop offset="100%" stopColor="currentColor" stopOpacity=".55"></stop></linearGradient><linearGradient id="mingcuteLoadingFill1" x1="50%" x2="50%" y1="15.24%" y2="87.15%"><stop offset="0%" stopColor="currentColor" stopOpacity="0"></stop><stop offset="100%" stopColor="currentColor" stopOpacity=".55"></stop></linearGradient></defs><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"></path><path fill="url(#mingcuteLoadingFill0)" d="M8.749.021a1.5 1.5 0 0 1 .497 2.958A7.502 7.502 0 0 0 3 10.375a7.5 7.5 0 0 0 7.5 7.5v3c-5.799 0-10.5-4.7-10.5-10.5C0 5.23 3.726.865 8.749.021Z" transform="translate(1.5 1.625)"></path><path fill="url(#mingcuteLoadingFill1)" d="M15.392 2.673a1.5 1.5 0 0 1 2.119-.115A10.475 10.475 0 0 1 21 10.375c0 5.8-4.701 10.5-10.5 10.5v-3a7.5 7.5 0 0 0 5.007-13.084a1.5 1.5 0 0 1-.115-2.118Z" transform="translate(1.5 1.625)"></path></g></svg>
                }
              </div>
              <span className='text-xs'>{task.tip}</span>
              {
                task.state === TaskState.UPLOADING
                ?
                <span className='text-xs font-mono'>{task.sizeProgress}</span>
                :
                null
              }
            </div>
          </div>)
        }
      </div>
    </CSSTransition>
  </div>
}

