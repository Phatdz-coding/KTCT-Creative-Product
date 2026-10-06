export type Scenario = {
  hours: number;
  workers: number;
  wage: number;
  price: number;
  material: number;
  operating: number;
  productivity: number;
};
export const baseline: Scenario = {
  hours: 8,
  workers: 3,
  wage: 240000,
  price: 50000,
  material: 15000,
  operating: 5000,
  productivity: 5,
};
export const money = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(n)) + " đ";
export function scenarioForCups(
  s: Omit<Scenario, "productivity">,
  cups: number,
): Scenario {
  return {
    hours: s.hours,
    workers: s.workers,
    wage: s.wage,
    price: s.price,
    material: s.material,
    operating: s.operating,
    productivity: cups / (s.hours * s.workers),
  };
}
export function calculate(s: Scenario, elapsed = s.hours) {
  const productivity =
    s.workers === 1 ? Math.min(s.productivity, 10) : s.productivity;
  const targetCups = Math.floor(
    s.hours * s.workers * s.productivity + 1e-8,
  );
  const capacityCups = Math.floor(
    s.hours * s.workers * productivity + 1e-8,
  );
  const cups = Math.floor(
    Math.min(Math.max(elapsed, 0), s.hours) * s.workers * productivity + 1e-8,
  );
  const revenue = cups * s.price;
  const materialCost = cups * s.material;
  const operatingCost = cups * s.operating;
  const wages = s.workers * s.wage;
  const totalCost = materialCost + operatingCost + wages;
  const hourlyValue =
    s.workers * productivity * (s.price - s.material - s.operating);
  const necessaryHours = hourlyValue > 0 ? wages / hourlyValue : Infinity;
  // Live sales count whole cups, so pause only once an actual sale covers wages.
  const contributionPerCup = s.price - s.material - s.operating;
  const recoveryHours =
    hourlyValue > 0
      ? Math.ceil(wages / contributionPerCup) / (s.workers * productivity)
      : Infinity;
  return {
    cups,
    targetCups,
    unfinishedCups: Math.max(0, targetCups - capacityCups),
    revenue,
    materialCost,
    operatingCost,
    wages,
    totalCost,
    surplus: revenue - totalCost,
    necessaryHours,
    recoveryHours,
    surplusHours: Math.max(0, s.hours - necessaryHours),
  };
}
export function clock(hours: number) {
  const m = Math.floor(hours * 60 + 1e-6);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
