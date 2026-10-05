import { Button } from '../components/common/Button.tsx'
import { DISCLAIMER, TOPIC_QUESTION } from '../content/metrics.ts'
import { useSimulatorStore } from '../features/simulator/simulator.store.ts'
import styles from './pages.module.css'

const STEPS = [
  { title: 'Điều chỉnh', text: 'Thay đổi tiền công, giờ làm, năng suất, giá bán và nhu cầu.' },
  { title: 'Chạy một ngày', text: 'Quán mở cửa, công nhân pha chế, hàng được bán ra.' },
  { title: 'Phân tích', text: 'Xem doanh thu được chia thành c, v và m như thế nào.' },
]

export function LandingPage({ onOpenTheory }: { onOpenTheory(): void }) {
  const setView = useSimulatorStore((s) => s.setView)

  return (
    <main className={styles.landing}>
      <div className={styles.landingInner}>
        <p className={styles.eyebrow}>Kinh tế chính trị Mác – Lênin · Mô phỏng tương tác</p>
        <h1 className={styles.landingTitle}>Capital Café</h1>
        <p className={styles.landingLead}>
          Một quán cà phê nhỏ để nhìn thấy tư bản, tiền công và giá trị thặng dư vận động trong một
          ngày lao động.
        </p>

        <blockquote className={styles.question}>
          <span className={styles.questionLabel}>Câu hỏi của buổi thuyết trình</span>
          {TOPIC_QUESTION}
        </blockquote>

        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.stepCard}>
              <span className={styles.stepNumber} aria-hidden="true">
                {index + 1}
              </span>
              <strong>{step.title}</strong>
              <span>{step.text}</span>
            </li>
          ))}
        </ol>

        <div className={styles.landingActions}>
          <Button variant="primary" size="large" onClick={() => setView('presentation')}>
            Bắt đầu thuyết trình
          </Button>
          <Button size="large" onClick={onOpenTheory}>
            Lý thuyết &amp; giả định
          </Button>
        </div>

        <p className={styles.landingDisclaimer}>{DISCLAIMER}</p>
      </div>
    </main>
  )
}
