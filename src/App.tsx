import { useEffect, useRef, useState } from "react";
import { Coffee, LockKeyhole, Settings2 } from "lucide-react";
import LandingPage from "./components/LandingPage";
import Header, { ShiftIntroduction } from "./components/Header";
import ShiftHUD from "./components/ShiftHUD";
import EconomicHUD from "./components/EconomicHUD";
import SimulationControls from "./components/SimulationControls";
import ObservationPanel from "./components/ObservationPanel";
import CoffeeShopScene from "./components/CoffeeShopScene";
import ShiftSettings from "./components/ShiftSettings";
import {
  EducationalModal,
  ExhaustionModal,
  Tip,
  ValueFormula,
  WhatIfSimulator,
} from "./components/Education";
import { useSimulation } from "./hooks/useSimulation";
import { baseline, calculate, clock, money } from "./lib/economics";
import { viewForHash, type View } from "./lib/view";

export default function App() {
  const [view, setView] = useState<View>(() => viewForHash(location.hash));
  const previousView = useRef(view);

  useEffect(() => {
    const changeView = () => setView(viewForHash(location.hash));
    addEventListener("hashchange", changeView);
    return () => removeEventListener("hashchange", changeView);
  }, []);

  useEffect(() => {
    if (previousView.current === view) return;
    previousView.current = view;
    scrollTo({ top: 0 });
    requestAnimationFrame(() => document.querySelector<HTMLElement>("main")?.focus());
  }, [view]);

  return view === "game" ? <BaristaGame /> : <LandingPage />;
}

function BaristaGame() {
  const [scenario, setScenario] = useState({ ...baseline });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const sim = useSimulation(scenario);
  const target = calculate(scenario);
  const v = sim.values;
  const [guide, setGuide] = useState(false);
  const done = sim.state === "completed";
  return (
    <>
      <Header guideOpen={guide} onGuide={() => setGuide(!guide)} />
      <main id="main" tabIndex={-1}>
        <ShiftIntroduction />
        {guide && (
          <aside className="guide" id="game-guide">
            <strong>Cách chơi</strong>
            <p>
              1. Thiết lập quán, bắt đầu ca và quan sát các barista. 2. Theo dõi
              số ly, doanh thu và chi phí. 3. Tiếp tục sau câu hỏi giữa ca. 4.
              Kết thúc ca để mở What If và thử thay đổi các điều kiện.
            </p>
            <p>
              Một ca trong quán ≈ 48 giây ở tốc độ 1×, chưa tính thời gian tạm
              dừng. Mỗi ly làm ra được giả định bán ngay. Tiền lương toàn ca
              được tính từ đầu nên giá trị còn lại ban đầu âm.
            </p>
          </aside>
        )}
        <div className="settings-toolbar">
          <span>
            {target.targetCups} ly / ca · {scenario.workers} barista ·{" "}
            {scenario.hours} giờ · {money(scenario.price)}/ly
          </span>
          <button
            className="button small"
            aria-expanded={settingsOpen}
            aria-controls="shift-settings-panel"
            disabled={sim.state !== "idle"}
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <Settings2 size={16} aria-hidden="true" />{" "}
            {settingsOpen ? "Đóng thiết lập" : "Thiết lập ca làm"}
          </button>
        </div>
        {sim.state !== "idle" && (
          <p className="settings-lock">
            Chọn “Chơi lại” để chỉnh thiết lập cho ca tiếp theo.
          </p>
        )}
        {settingsOpen && sim.state === "idle" && (
          <div id="shift-settings-panel">
            <ShiftSettings
              scenario={scenario}
              onApply={(s) => {
                setScenario(s);
                sim.reset();
              }}
            />
          </div>
        )}
        <section className="simulation" aria-label="Mô phỏng ca làm">
          <ShiftHUD
            hours={sim.hours}
            duration={scenario.hours}
            state={sim.state}
          />
          <CoffeeShopScene
            speed={sim.speed}
            running={sim.state === "running"}
            hours={sim.hours}
            cups={v.cups}
            scenario={scenario}
          />
        </section>
        <EconomicHUD scenario={scenario} values={v} />
        <SimulationControls
          sim={sim}
          onStart={() => {
            setSettingsOpen(false);
            sim.start();
          }}
        />
        <ObservationPanel sim={sim} duration={scenario.hours} />
        {!sim.revealed ? (
          <section className="starting-lesson">
            <div>
              <span className="lesson-number">01</span>
              <div>
                <h3>Một quán cà phê cần những gì?</h3>
                <p>
                  <strong>Doanh nghiệp cung cấp:</strong> mặt bằng, máy móc,
                  nguyên liệu.
                  <br />
                  <strong>Người lao động cung cấp:</strong> sức lao động.
                </p>
              </div>
            </div>
            <div className="locked">
              <LockKeyhole size={17} />
              <span>
                Quan sát ca làm để khám phá
                <br />
                câu chuyện phía sau mỗi ly cà phê.
              </span>
            </div>
          </section>
        ) : (
          <section className="timeline-section">
            <div className="section-heading">
              <h3>Một ca làm, hai khoảng thời gian</h3>
              <span>08:00 — {clock(8 + scenario.hours)}</span>
            </div>
            <div className="labor-timeline">
              <div
                style={{
                  width: `${(target.necessaryHours / scenario.hours) * 100}%`,
                }}
              >
                {clock(target.necessaryHours)}
              </div>
              <div>{clock(target.surplusHours)}</div>
            </div>
            <div className="timeline-explanations">
              <p>
                <strong>
                  <span className="legend-dot necessary" />
                  Thời gian lao động tất yếu{" "}
                  <Tip text="Khoảng thời gian người lao động tạo ra lượng giá trị tương ứng với giá trị sức lao động của mình." />
                </strong>
                Khoảng thời gian người lao động tạo ra lượng giá trị tương ứng
                với giá trị sức lao động của mình.
              </p>
              <p>
                <strong>
                  <span className="legend-dot surplus" />
                  Thời gian lao động thặng dư{" "}
                  <Tip text="Khoảng thời gian lao động tiếp tục tạo ra giá trị vượt quá phần tương ứng với tiền lương." />
                </strong>
                Khoảng thời gian lao động tiếp tục tạo ra giá trị vượt quá phần
                tương ứng với tiền lương.
              </p>
            </div>
          </section>
        )}
        {done && (
          <>
            <section className="end-summary">
              <span className="eyebrow">BẠN ĐÃ HOÀN THÀNH NGÀY ĐẦU TIÊN</span>
              <h2>
                Ca làm kết thúc <span>✦</span>
              </h2>
              <div>
                {[
                  ["Tổng số ly", `${v.cups} ly`],
                  ["Tổng doanh thu", money(v.revenue)],
                  ["Tổng chi phí (gồm lương)", money(v.totalCost)],
                  ["Tổng tiền lương", money(v.wages)],
                  ["Giá trị còn lại", money(v.surplus)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <a href="#what-if" className="button primary">
                Thử một kịch bản khác ↗
              </a>
            </section>
            {target.recoveryHours >= scenario.hours && (
              <p className="guide">
                {target.surplus < 0
                  ? "Ca này chưa bù đủ tiền lương sau khi trừ nguyên liệu và vận hành. Không có thời gian lao động thặng dư trong ca theo mô hình; hãy thử thay đổi các điều kiện bên dưới."
                  : "Ca này chỉ bù đủ tiền lương khi kết thúc; không còn thời gian lao động thặng dư trong ca."}
              </p>
            )}
            <ValueFormula scenario={scenario} />
            <WhatIfSimulator initialScenario={scenario} />
          </>
        )}
        <footer>
          <span>
            <Coffee size={14} /> COFFEE & SOCIETY
          </span>
          <p>Mô hình mô phỏng giáo dục đơn giản hóa</p>
          <span>Quan sát. Đặt câu hỏi. Khám phá.</span>
        </footer>
      </main>
      {sim.question && (
        <EducationalModal hours={sim.hours} onContinue={sim.resume} />
      )}
      {sim.exhaustion && (
        <ExhaustionModal
          completed={v.cups}
          target={target.targetCups}
          onContinue={sim.dismissExhaustion}
        />
      )}
    </>
  );
}
