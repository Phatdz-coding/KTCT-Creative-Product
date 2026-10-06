import { BookOpen, Coffee, Sprout } from "lucide-react";

export default function Header({
  guideOpen,
  onGuide,
}: {
  guideOpen: boolean;
  onGuide: () => void;
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        Đến mô phỏng
      </a>
      <header className="site-header">
        <a className="brand" href="#main">
          <span className="brand-icon">
            <Coffee aria-hidden="true" size={24} />
          </span>
          <span>
            Coffee <em>&</em> Society
            <small>Mỗi ly cà phê là một câu chuyện kinh tế</small>
          </span>
        </a>
        <div className="header-actions">
          <span className="edition">
            <span /> MÔ PHỎNG KINH TẾ · CHƯƠNG 01
          </span>
          <button
            className="guide-button"
            aria-expanded={guideOpen}
            aria-controls="game-guide"
            onClick={onGuide}
          >
            <BookOpen aria-hidden="true" size={17} /> Cách chơi
          </button>
        </div>
      </header>
    </>
  );
}

export function ShiftIntroduction() {
  return (
    <div className="intro">
      <div>
        <span className="eyebrow">
          <span className="tiny-square" /> MỘT CA LÀM · NHIỀU ĐIỀU ĐỂ KHÁM PHÁ
        </span>
        <h1>
          Ca làm việc của <em>Barista</em>
        </h1>
        <p>Lao động tạo ra giá trị — Hiểu kinh tế từ những điều gần gũi nhất</p>
      </div>
      <aside className="objective-card">
        <span className="objective-icon">
          <Sprout size={26} aria-hidden="true" />
        </span>
        <div>
          <span className="eyebrow">CA SÁNG · NGÀY 01</span>
          <p>
            Quan sát cách một ly cà phê tạo ra
            <br className="desktop-break" /> doanh thu, chi phí và giá trị mới.
          </p>
        </div>
        <span className="objective-star" aria-hidden="true">
          ✦
        </span>
      </aside>
    </div>
  );
}
