import { Clock3 } from "lucide-react";
import { clock } from "../lib/economics";
import type { useSimulation } from "../hooks/useSimulation";
type State = ReturnType<typeof useSimulation>["state"];
export default function ShiftHUD({
  hours,
  duration,
  state,
}: {
  hours: number;
  duration: number;
  state: State;
}) {
  return (
    <div className="shift-hud">
      <div className="shift-label">
        <span className="hud-clock-icon">
          <Clock3 size={23} aria-hidden="true" />
        </span>
        <strong>
          Tiến độ ca làm<small>{duration} GIỜ · 1 CA LÀM</small>
        </strong>
      </div>
      <div className="shift-track">
        <div
          className="shift-progress"
          role="progressbar"
          aria-label="Tiến độ ca làm"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={Number(hours.toFixed(2))}
          aria-valuetext={`${clock(hours)} / ${clock(duration)}`}
        >
          <div style={{ transform: `scaleX(${hours / duration})` }} />
        </div>
        <div className="time-markers" aria-hidden="true">
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <span key={t}>{clock(8 + duration * t)}</span>
          ))}
        </div>
      </div>
      <span className="clock">
        {clock(hours)} <span>/ {clock(duration)}</span>
      </span>
      <span className={`status ${state}`} role="status">
        <span />
        {
          {
            idle: "Sẵn sàng",
            running: "Đang làm",
            paused: "Tạm dừng",
            completed: "Hoàn thành",
          }[state]
        }
      </span>
    </div>
  );
}
