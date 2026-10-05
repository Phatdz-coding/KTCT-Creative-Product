import { useId } from 'react'
import styles from './common.module.css'

interface InfoTooltipProps {
  /** Name of the thing being explained, for screen readers. */
  label: string
  text: string
}

/** The bubble spans the nearest positioned ancestor, so place it inside a `position: relative` panel. */
export function InfoTooltip({ label, text }: InfoTooltipProps) {
  const id = useId()
  return (
    <span className={styles.tip}>
      <button
        type="button"
        className={styles.tipButton}
        aria-label={`Giải thích: ${label}`}
        aria-describedby={id}
      >
        ?
      </button>
      <span role="tooltip" id={id} className={styles.tipBubble}>
        {text}
      </span>
    </span>
  )
}
