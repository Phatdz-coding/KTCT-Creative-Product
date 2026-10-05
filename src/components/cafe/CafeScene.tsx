import { motion } from 'framer-motion'
import { PHASE_DURATION_MS } from '../../features/simulator/simulator.store.ts'
import type { SimulationPhase } from '../../features/simulator/simulator.types.ts'
import { formatVND } from '../../lib/currency.ts'
import { formatClock, formatNumber } from '../../lib/number.ts'
import styles from './cafe.module.css'

interface CafeSceneProps {
  phase: SimulationPhase
  employeeCount: number
  workingHours: number
  productPrice: number
  /** null until a simulation has been run. */
  unitsSold: number | null
  productionCapacity: number | null
  /** Share of productivity lost to overload, 0–1; 0 when workers are not overloaded. */
  productivityLoss: number
}

const OPENING_HOUR = 8
const MAX_WORKER_FIGURES = 5
const MAX_CUSTOMER_FIGURES = 6

// How far through the working day the clock shows in each phase.
const DAY_PROGRESS: Record<SimulationPhase, number> = {
  idle: 0,
  opening: 0,
  working: 0.6,
  serving: 0.95,
  accounting: 1,
  result: 1,
}

const CUSTOMER_COLOURS = ['#a8704a', '#6f7f5c', '#9a5a63', '#5f7390', '#b08a3e', '#7b6a8c']

// The scene shows order volume as low / medium / high, not one figure per cup.
const customerFigures = (unitsSold: number | null): number => {
  if (unitsSold === null || unitsSold <= 0) return 0
  if (unitsSold <= 60) return 2
  if (unitsSold <= 150) return 4
  return MAX_CUSTOMER_FIGURES
}

const hourHandAngle = (hour: number) => (hour % 12) * 30

export function CafeScene({
  phase,
  employeeCount,
  workingHours,
  productPrice,
  unitsSold,
  productionCapacity,
  productivityLoss,
}: CafeSceneProps) {
  const open = phase !== 'idle'
  const busy = phase === 'working' || phase === 'serving'
  const serving = phase === 'serving'
  const overloaded = open && productivityLoss > 0

  const workerFigures = Math.min(employeeCount, MAX_WORKER_FIGURES)
  const extraWorkers = employeeCount - workerFigures
  const customers = open ? customerFigures(unitsSold) : 0

  const closingHour = OPENING_HOUR + workingHours
  const currentHour = OPENING_HOUR + workingHours * DAY_PROGRESS[phase]
  const phaseSeconds = (PHASE_DURATION_MS[phase] ?? 300) / 1000

  const ribbon: Record<SimulationPhase, string> = {
    idle: 'Quán chưa mở cửa — nhấn «Chạy mô phỏng»',
    opening: `${formatClock(OPENING_HOUR)} · Quán mở cửa`,
    working: 'Công nhân đang pha chế…',
    serving: 'Khách đến mua, hàng được bán ra…',
    accounting: 'Hạch toán: doanh thu − chi phí − tiền công',
    result:
      unitsSold !== null && productionCapacity !== null
        ? `Hết ngày: bán ${formatNumber(unitsSold)} ly · công suất ${formatNumber(productionCapacity)} ly${overloaded ? ' · quá tải' : ''}`
        : 'Hết ngày',
  }

  return (
    <svg
      className={`${styles.scene} ${open ? '' : styles.sceneClosed}`}
      viewBox="0 0 600 300"
      role="img"
      aria-label={`Quán cà phê với ${employeeCount} công nhân. ${ribbon[phase]}`}
    >
      {/* Room */}
      <rect width="600" height="232" fill="var(--scene-wall)" />
      <rect y="232" width="600" height="68" fill="var(--scene-floor)" />
      <rect y="230" width="600" height="4" fill="var(--scene-skirting)" />

      {/* Window */}
      <rect x="24" y="34" width="118" height="92" rx="6" fill="var(--scene-sky)" />
      <rect
        x="24"
        y="34"
        width="118"
        height="92"
        rx="6"
        fill="none"
        stroke="var(--scene-wood)"
        strokeWidth="5"
      />
      <path d="M83 34v92M24 80h118" stroke="var(--scene-wood)" strokeWidth="3" />

      {/* Menu board */}
      <rect x="172" y="28" width="156" height="92" rx="5" fill="var(--espresso)" />
      <text x="250" y="54" className={styles.boardTitle} textAnchor="middle">
        CAPITAL CAFÉ
      </text>
      <path d="M190 63h120" stroke="var(--on-dark)" strokeWidth="1" opacity="0.4" />
      <text x="250" y="83" className={styles.boardLine} textAnchor="middle">
        1 ly · {formatVND(productPrice)}
      </text>
      <text x="250" y="103" className={styles.boardLine} textAnchor="middle">
        {formatClock(OPENING_HOUR)} – {formatClock(closingHour)}
      </text>

      {/* Clock */}
      <circle
        cx="382"
        cy="66"
        r="31"
        fill="var(--surface)"
        stroke="var(--espresso)"
        strokeWidth="4"
      />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="382"
          y1="40"
          x2="382"
          y2={i % 3 === 0 ? 46 : 43}
          stroke="var(--ink-soft)"
          strokeWidth={i % 3 === 0 ? 2 : 1}
          transform={`rotate(${i * 30} 382 66)`}
        />
      ))}
      {/* The invisible circle centres the group's bounding box on the clock,
          so the rotation pivots around the clock centre. */}
      <motion.g
        initial={false}
        animate={{ rotate: hourHandAngle(currentHour) }}
        transition={{ duration: phaseSeconds, ease: 'linear' }}
      >
        <circle cx="382" cy="66" r="31" fill="none" />
        <line
          x1="382"
          y1="66"
          x2="382"
          y2="46"
          stroke="var(--m)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </motion.g>
      <circle cx="382" cy="66" r="3.5" fill="var(--espresso)" />
      <text x="382" y="120" className={styles.clockText} textAnchor="middle">
        {formatClock(currentHour)}
      </text>

      {/* Open / closed sign */}
      <path d="M470 30v16M530 30v16" stroke="var(--ink-soft)" strokeWidth="1.5" />
      <rect x="444" y="46" width="112" height="36" rx="5" fill={open ? 'var(--v)' : 'var(--c)'} />
      <text x="500" y="70" className={styles.signText} textAnchor="middle">
        {open ? 'MỞ CỬA' : 'ĐÓNG CỬA'}
      </text>

      {/* Workers stand behind the counter */}
      {Array.from({ length: workerFigures }, (_, i) => (
        <g key={i} transform={`translate(${66 + i * 56} 0)`}>
          <motion.g
            animate={busy ? { y: [0, -5, 0] } : { y: 0 }}
            transition={
              busy
                ? { duration: 0.55, repeat: Infinity, delay: i * 0.09, ease: 'easeInOut' }
                : { duration: 0.2 }
            }
          >
            <rect x="-18" y="140" width="36" height="60" rx="13" fill="var(--v)" />
            <rect
              x="-9"
              y="154"
              width="18"
              height="40"
              rx="3"
              fill="var(--surface)"
              opacity="0.9"
            />
            <circle cy="126" r="14" fill="var(--scene-skin)" />
            <path d="M-14 124a14 14 0 0 1 28 0c-6-7-22-7-28 0z" fill="var(--espresso)" />
          </motion.g>
        </g>
      ))}
      {extraWorkers > 0 && (
        <g>
          <circle cx="334" cy="142" r="16" fill="var(--v)" />
          <text x="334" y="147" className={styles.extraText} textAnchor="middle">
            +{extraWorkers}
          </text>
        </g>
      )}

      {/* Counter */}
      <rect x="30" y="180" width="350" height="72" rx="4" fill="var(--scene-wood)" />
      <rect x="22" y="172" width="366" height="13" rx="4" fill="var(--scene-wood-light)" />
      <path d="M118 190v56M206 190v56M294 190v56" stroke="var(--espresso)" opacity="0.25" />

      {/* Overload notice on the counter front */}
      {overloaded && phase !== 'opening' && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <rect x="97" y="200" width="216" height="34" rx="6" fill="var(--m)" />
          <text x="205" y="223" className={styles.overloadText} textAnchor="middle">
            QUÁ TẢI · năng suất −{formatNumber(productivityLoss * 100, 0)}%
          </text>
        </motion.g>
      )}

      {/* Cups lined up on the counter once production starts */}
      {Array.from({ length: workerFigures }, (_, i) => (
        <motion.g
          key={i}
          initial={false}
          animate={{ opacity: busy || phase === 'accounting' || phase === 'result' ? 1 : 0 }}
          transition={{ duration: 0.25, delay: busy ? 0.15 + i * 0.12 : 0 }}
        >
          <path
            d={`M${90 + i * 56} 158h14l-2 14h-10z`}
            fill="var(--surface)"
            stroke="var(--espresso)"
            strokeWidth="1.5"
          />
        </motion.g>
      ))}

      {/* Cups handed across the counter while serving */}
      {serving &&
        customers > 0 &&
        [0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d="M360 154h14l-2 14h-10z"
            fill="var(--surface)"
            stroke="var(--m)"
            strokeWidth="2"
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: [0, 62], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2, ease: 'easeOut' }}
          />
        ))}

      {/* Customers queue on the shop floor */}
      {Array.from({ length: customers }, (_, i) => (
        <motion.g
          key={i}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 + i * 0.1 }}
        >
          <g transform={`translate(${424 + i * 29} ${i % 2 === 0 ? 0 : 10})`}>
            <rect x="-14" y="182" width="28" height="62" rx="12" fill={CUSTOMER_COLOURS[i]} />
            <circle cy="168" r="13" fill="var(--scene-skin)" />
          </g>
        </motion.g>
      ))}

      {/* Status ribbon */}
      <rect y="264" width="600" height="36" fill="var(--espresso)" opacity="0.92" />
      <text x="300" y="289" className={styles.ribbonText} textAnchor="middle">
        {ribbon[phase]}
      </text>
    </svg>
  )
}
