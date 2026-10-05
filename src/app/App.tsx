import { MotionConfig, useReducedMotion } from 'framer-motion'
import { lazy, Suspense, useState } from 'react'
import { AppHeader } from '../components/common/AppHeader.tsx'
import { TheoryDrawer } from '../components/theory/TheoryDrawer.tsx'
import { useSimulatorStore } from '../features/simulator/simulator.store.ts'
import { usePresenterShortcuts } from '../features/simulator/usePresenterShortcuts.ts'
import { LandingPage } from '../pages/LandingPage.tsx'
import { PresentationPage } from '../pages/PresentationPage.tsx'
import styles from './App.module.css'

// The compare view pulls in the charting library, so it loads on demand.
const ComparePage = lazy(() =>
  import('../pages/ComparePage.tsx').then((module) => ({ default: module.ComparePage })),
)

function App() {
  const view = useSimulatorStore((s) => s.view)
  const [theoryOpen, setTheoryOpen] = useState(false)
  const openTheory = () => setTheoryOpen(true)
  const reducedMotion = useReducedMotion()

  usePresenterShortcuts(!reducedMotion)

  return (
    <MotionConfig reducedMotion="user">
      {view === 'landing' ? (
        <LandingPage onOpenTheory={openTheory} />
      ) : (
        <div className={styles.shell}>
          <AppHeader onOpenTheory={openTheory} />
          {view === 'presentation' ? (
            <PresentationPage onOpenTheory={openTheory} />
          ) : (
            <Suspense fallback={null}>
              <ComparePage />
            </Suspense>
          )}
        </div>
      )}
      <TheoryDrawer open={theoryOpen} onClose={() => setTheoryOpen(false)} />
    </MotionConfig>
  )
}

export default App
