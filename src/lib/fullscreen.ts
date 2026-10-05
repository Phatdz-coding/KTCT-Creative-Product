import { useSyncExternalStore } from 'react'

const subscribe = (onChange: () => void) => {
  document.addEventListener('fullscreenchange', onChange)
  return () => document.removeEventListener('fullscreenchange', onChange)
}

export const useIsFullscreen = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => document.fullscreenElement !== null,
    () => false,
  )

export const fullscreenSupported = (): boolean =>
  typeof document !== 'undefined' &&
  typeof document.documentElement.requestFullscreen === 'function'

export const toggleFullscreen = (): void => {
  if (!fullscreenSupported()) return
  // The browser may refuse (permissions, iframe); the app works the same either way.
  const request = document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen()
  request.catch(() => {})
}
