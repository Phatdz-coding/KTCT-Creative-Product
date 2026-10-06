import { useEffect, useState } from "react";
import { calculate, type Scenario } from "../lib/economics";
type State = "idle" | "running" | "paused" | "completed";
export function useSimulation(scenario: Scenario) {
  const [state, setState] = useState<State>("idle");
  const [hours, setHours] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [revealed, setRevealed] = useState(false);
  const [question, setQuestion] = useState(false);
  const recovery = calculate(scenario).recoveryHours;
  useEffect(() => {
    if (state !== "running") return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta =
        ((Math.min(now - previous, 250) / 1000) * speed * scenario.hours) / 48;
      previous = now;
      setHours((h) =>
        Math.min(
          scenario.hours,
          !revealed ? Math.min(h + delta, recovery) : h + delta,
        ),
      );
    }, 50);
    return () => clearInterval(timer);
  }, [state, speed, revealed, recovery, scenario.hours]);
  useEffect(() => {
    if (state !== "running") return;
    if (hours >= scenario.hours) setState("completed");
    else if (!revealed && hours >= recovery) {
      setQuestion(true);
      setState("paused");
    }
  }, [hours, recovery, revealed, state, scenario.hours]);
  const reset = () => {
    setState("idle");
    setHours(0);
    setRevealed(false);
    setQuestion(false);
    setSpeed(1);
  };
  return {
    state,
    hours,
    speed,
    revealed,
    question,
    values: calculate(scenario, hours),
    start: () => setState("running"),
    pause: () => setState("paused"),
    fast: () => setSpeed((s) => (s === 4 ? 1 : s * 2)),
    reset,
    resume: () => {
      setQuestion(false);
      setRevealed(true);
      setState("running");
    },
  };
}
