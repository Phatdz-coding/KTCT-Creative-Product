import { useId, useState } from 'react'
import type { CSSProperties } from 'react'
import type { ParameterDefinition } from '../../features/simulator/parameters.data.ts'
import { clamp, formatNumber, snapToStep } from '../../lib/number.ts'
import styles from './controls.module.css'

interface ParameterSliderProps {
  definition: ParameterDefinition
  value: number
  /** Value in the selected scenario; a different value is marked as changed. */
  scenarioValue: number
  disabled?: boolean
  onChange(value: number): void
}

export function ParameterSlider({
  definition,
  value,
  scenarioValue,
  disabled = false,
  onChange,
}: ParameterSliderProps) {
  const { label, unit, min, max, step } = definition
  const id = useId()
  // Text being typed; null while the field just mirrors the committed value.
  const [draft, setDraft] = useState<string | null>(null)

  const changed = value !== scenarioValue
  const fill = max > min ? ((value - min) / (max - min)) * 100 : 0

  const commit = () => {
    if (draft === null) return
    const parsed = Number(draft.trim().replace(',', '.'))
    if (draft.trim() !== '' && Number.isFinite(parsed)) {
      onChange(clamp(snapToStep(parsed, min, step), min, max))
    }
    setDraft(null)
  }

  return (
    <div className={`${styles.field} ${changed ? styles.changed : ''}`}>
      <div className={styles.fieldTop}>
        <label className={styles.fieldLabel} htmlFor={id}>
          {label}
          {changed && (
            <>
              <span className={styles.changedDot} aria-hidden="true" />
              <span className="sr-only">
                (đã thay đổi, kịch bản gốc: {formatNumber(scenarioValue)})
              </span>
            </>
          )}
        </label>
        <span className={styles.valueBox}>
          <input
            id={id}
            className={styles.number}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            disabled={disabled}
            value={draft ?? formatNumber(value)}
            onFocus={(event) => {
              setDraft(String(value))
              // Select after React has swapped in the raw number.
              const input = event.currentTarget
              requestAnimationFrame(() => input.select())
            }}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur()
              if (event.key === 'Escape') {
                setDraft(null)
                event.currentTarget.blur()
              }
            }}
          />
          <span className={styles.unit}>{unit}</span>
        </span>
      </div>
      <input
        className={styles.range}
        style={{ '--fill': `${fill}%` } as CSSProperties}
        type="range"
        aria-label={`${label} (thanh trượt)`}
        aria-valuetext={`${formatNumber(value)} ${unit}`}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}
