import { useEffect } from 'react'
import { toggleFullscreen } from '../../lib/fullscreen.ts'
import { SCENARIOS } from '../scenarios/scenarios.data.ts'
import { useSimulatorStore } from './simulator.store.ts'

// Sliders keep focus after a drag, and letters or digits mean nothing to them,
// so only real text entry suppresses the shortcuts.
const NON_TEXT_INPUTS = ['range', 'checkbox', 'radio', 'button', 'submit', 'reset']

const isTyping = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false
  if (target instanceof HTMLInputElement) return !NON_TEXT_INPUTS.includes(target.type)
  return target.isContentEditable || ['TEXTAREA', 'SELECT'].includes(target.tagName)
}

/**
 * Keyboard shortcuts for presenting: 1–7 pick a scenario, R runs, F toggles fullscreen.
 * Letters and digits never clash with activating a focused button (Enter / Space).
 */
export function usePresenterShortcuts(animate: boolean) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return
      if (isTyping(event.target) || document.querySelector('dialog[open]')) return

      const store = useSimulatorStore.getState()
      const key = event.key.toLowerCase()

      if (key === 'f') {
        toggleFullscreen()
      } else if (store.view !== 'presentation') {
        return
      } else if (key === 'r') {
        if (store.simulationStatus !== 'running') store.run({ animate })
      } else if (/^[1-9]$/.test(key) && SCENARIOS[Number(key) - 1]) {
        store.loadScenario(SCENARIOS[Number(key) - 1].id)
      } else {
        return
      }
      event.preventDefault()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [animate])
}
