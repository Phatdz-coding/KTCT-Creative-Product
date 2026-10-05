import type { ButtonHTMLAttributes } from 'react'
import styles from './common.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost'
  size?: 'normal' | 'large'
  block?: boolean
}

export function Button({
  variant = 'default',
  size = 'normal',
  block = false,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'ghost' && styles.ghost,
    size === 'large' && styles.large,
    block && styles.block,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <button type={type} className={classes} {...rest} />
}
