import { Play, Pause, FastForward, RotateCcw, Timer } from "lucide-react";
import type { useSimulation } from "../hooks/useSimulation";
export default function SimulationControls({
  sim,
  onStart,
}: {
  sim: ReturnType<typeof useSimulation>;
  onStart: () => void;
}) {
  return (
    <div className="controls">
      <div className="control-buttons">
        <button
          className="button primary start-button"
          disabled={
            sim.state === "running" || sim.state === "completed" || sim.question
          }
          onClick={onStart}
        >
          <Play size={18} fill="currentColor" aria-hidden="true" />
          {sim.state === "paused" ? "Tiếp tục ca làm" : "Bắt đầu ca làm"}
        </button>
        <button
          className="button"
          disabled={sim.state === "completed" || sim.question}
          onClick={sim.fast}
        >
          <FastForward size={18} aria-hidden="true" /> Tua nhanh{" "}
          <span className="speed">{sim.speed}×</span>
        </button>
        <button
          className="button"
          disabled={sim.state !== "running"}
          onClick={sim.pause}
        >
          <Pause size={18} aria-hidden="true" /> Tạm dừng
        </button>
        <button className="button reset" onClick={sim.reset}>
          <RotateCcw size={18} aria-hidden="true" /> Chơi lại
        </button>
      </div>
      <span className="real-time">
        <Timer size={18} aria-hidden="true" />
        <span>
          1 ca làm ≈ 48 giây<small>Thời gian thực ở tốc độ 1×</small>
        </span>
      </span>
    </div>
  );
}
