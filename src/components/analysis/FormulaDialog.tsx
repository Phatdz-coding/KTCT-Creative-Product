import { useEffect, useRef } from 'react'
import type { SimulationInput, SimulationResult } from '../../features/simulator/simulator.types.ts'
import { Button } from '../common/Button.tsx'
import styles from './analysis.module.css'
import { FormulaBreakdown } from './FormulaBreakdown.tsx'

interface FormulaDialogProps {
  open: boolean
  input: SimulationInput
  result: SimulationResult
  onClose(): void
}

export function FormulaDialog({ open, input, result, onClose }: FormulaDialogProps) {
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
      className={styles.formulaDialog}
      aria-labelledby="formula-title"
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.formulaInner}>
        <header className={styles.formulaHead}>
          <h2 id="formula-title">Cách tính các con số</h2>
          <Button onClick={onClose}>Đóng</Button>
        </header>
        <FormulaBreakdown input={input} result={result} />
      </div>
    </dialog>
  )
}
