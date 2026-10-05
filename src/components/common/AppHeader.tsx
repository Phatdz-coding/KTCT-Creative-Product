import { useSimulatorStore } from '../../features/simulator/simulator.store.ts'
import { fullscreenSupported, toggleFullscreen, useIsFullscreen } from '../../lib/fullscreen.ts'
import styles from './common.module.css'

interface AppHeaderProps {
  onOpenTheory(): void
}

export function AppHeader({ onOpenTheory }: AppHeaderProps) {
  const view = useSimulatorStore((s) => s.view)
  const setView = useSimulatorStore((s) => s.setView)
  const hasA = useSimulatorStore((s) => s.snapshotA !== null)
  const hasB = useSimulatorStore((s) => s.snapshotB !== null)
  const isFullscreen = useIsFullscreen()

  const navClass = (active: boolean) =>
    `${styles.navItem} ${active ? styles.navItemActive : ''}`.trim()

  return (
    <header className={styles.header}>
      <button type="button" className={styles.brand} onClick={() => setView('landing')}>
        <span className={styles.brandName}>Capital Café</span>
        <span className={styles.brandTag}>Mô phỏng kinh tế chính trị</span>
      </button>

      <nav className={styles.nav} aria-label="Điều hướng chính">
        <button
          type="button"
          className={navClass(view === 'presentation')}
          aria-current={view === 'presentation' ? 'page' : undefined}
          onClick={() => setView('presentation')}
        >
          Mô phỏng
        </button>
        <button
          type="button"
          className={navClass(view === 'compare')}
          aria-current={view === 'compare' ? 'page' : undefined}
          onClick={() => setView('compare')}
        >
          So sánh
          <span className={`${styles.badge} ${hasA ? styles.badgeFilled : ''}`} aria-hidden="true">
            A
          </span>
          <span className={`${styles.badge} ${hasB ? styles.badgeFilled : ''}`} aria-hidden="true">
            B
          </span>
          <span className="sr-only">
            {hasA ? 'đã lưu A' : 'chưa lưu A'}, {hasB ? 'đã lưu B' : 'chưa lưu B'}
          </span>
        </button>
        <button type="button" className={styles.navItem} onClick={onOpenTheory}>
          Lý thuyết
        </button>
        {fullscreenSupported() && (
          <button
            type="button"
            className={`${styles.navItem} ${styles.fullscreenButton}`}
            aria-keyshortcuts="F"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
            <span className={styles.kbd} aria-hidden="true">
              F
            </span>
          </button>
        )}
      </nav>
    </header>
  )
}
