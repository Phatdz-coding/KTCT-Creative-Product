import { useEffect, useRef } from 'react'
import { DISCLAIMER } from '../../content/metrics.ts'
import { MODEL_ASSUMPTIONS, THEORY_TERMS } from '../../content/theory.ts'
import { Button } from '../common/Button.tsx'
import styles from './theory.module.css'

interface TheoryDrawerProps {
  open: boolean
  onClose(): void
}

export function TheoryDrawer({ open, onClose }: TheoryDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // The native modal dialog traps focus, closes on Escape and restores focus on close.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={styles.drawer}
      aria-labelledby="theory-title"
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 id="theory-title">Lý thuyết &amp; giả định</h2>
          <Button onClick={onClose}>Đóng</Button>
        </header>

        <p className={styles.disclaimer}>{DISCLAIMER}</p>

        <h3 className={styles.sectionTitle}>Các khái niệm</h3>
        <dl className={styles.terms}>
          {THEORY_TERMS.map((item) => (
            <div key={item.term} className={styles.term}>
              <dt>
                {item.term}
                {item.symbol && <span className={styles.symbol}>{item.symbol}</span>}
              </dt>
              <dd>
                {item.definition}
                {item.inSimulator && (
                  <span className={styles.inSimulator}>Trong mô phỏng: {item.inSimulator}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <h3 className={styles.sectionTitle}>Giả định của mô hình</h3>
        <ul className={styles.assumptions}>
          {MODEL_ASSUMPTIONS.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
      </div>
    </dialog>
  )
}
