import { test } from "node:test";
import assert from "node:assert/strict";
import { baseline, calculate, clock, scenarioForCups } from "./economics.ts";
test("full shift balances revenue, costs, wages and surplus", () => {
  const v = calculate(baseline);
  assert.equal(v.cups, 120);
  assert.equal(v.revenue, 6000000);
  assert.equal(v.materialCost, 1800000);
  assert.equal(v.operatingCost, 600000);
  assert.equal(v.wages, 720000);
  assert.equal(v.totalCost, 3120000);
  assert.equal(v.surplus, 2880000);
  assert.equal(v.necessaryHours, 1.6);
  assert.equal(v.surplusHours, 6.4);
});
test("wage recovery occurs at 24 cups, 1 hour 36 minutes", () => {
  const v = calculate(baseline, 1.6);
  assert.equal(v.cups, 24);
  assert.equal(v.surplus, 0);
  assert.equal(clock(1.6), "01:36");
});
test("idle reserves full shift wages and makes no sales", () => {
  const v = calculate(baseline, 0);
  assert.equal(v.cups, 0);
  assert.equal(v.revenue, 0);
  assert.equal(v.surplus, -720000);
});
test("longer hours and productivity update scenario immediately", () => {
  assert.equal(calculate({ ...baseline, hours: 10 }).cups, 150);
  assert.equal(calculate({ ...baseline, productivity: 8 }).necessaryHours, 1);
});
test("nonpositive margins and short shifts never produce negative surplus hours", () => {
  const v = calculate({ ...baseline, price: 20000, material: 30000 });
  assert.equal(v.necessaryHours, Infinity);
  assert.equal(v.surplusHours, 0);
  assert.equal(
    calculate({ ...baseline, productivity: 2, wage: 600000, hours: 4 })
      .surplusHours,
    0,
  );
});
test("time stays within the shift and produces whole cups", () => {
  assert.equal(calculate(baseline, -1).cups, 0);
  assert.equal(calculate(baseline, 20).cups, 120);
  assert.equal(calculate(baseline, 0.1).cups, 1);
  assert.equal(clock(8), "08:00");
});
test("configured cup target determines productivity and full-shift totals", () => {
  const s = scenarioForCups(
    {
      ...baseline,
      hours: 10,
      workers: 4,
      wage: 300000,
      price: 60000,
      operating: 10000,
    },
    200,
  );
  const v = calculate(s);
  assert.equal(s.productivity, 5);
  assert.equal(v.cups, 200);
  assert.equal(v.revenue, 12000000);
  assert.equal(v.wages, 1200000);
  assert.equal(v.totalCost, 6200000);
  assert.equal(v.surplus, 5800000);
});
test("arbitrary integer cup targets are reached without rounding loss", () => {
  for (const cups of [1, 37, 121, 997, 1000]) {
    for (const workers of [3, 6]) {
      const s = scenarioForCups({ ...baseline, hours: 7, workers }, cups);
      assert.equal(calculate(s).cups, cups);
    }
  }
});
test("one barista cannot finish a workload above human capacity", () => {
  const s = scenarioForCups({ ...baseline, workers: 1 }, 100);
  const v = calculate(s);
  assert.equal(v.cups, 80);
  assert.equal(v.targetCups, 100);
  assert.equal(v.unfinishedCups, 20);
  assert.equal(v.revenue, 4000000);
});
test("live recovery waits for a whole cup sale to cover wages", () => {
  const s = scenarioForCups({ ...baseline, wage: 241000 }, 121);
  const v = calculate(s);
  assert.ok(v.recoveryHours > v.necessaryHours);
  assert.ok(calculate(s, v.recoveryHours).surplus >= 0);
  assert.ok(calculate(s, v.recoveryHours - 0.0001).surplus < 0);
});
test("low cup targets and negative margins have no recovery within shift", () => {
  const s = scenarioForCups(baseline, 10);
  assert.ok(calculate(s).recoveryHours > s.hours);
  assert.equal(calculate(s).surplusHours, 0);
  assert.equal(
    calculate({ ...s, price: 20000, material: 30000 }).recoveryHours,
    Infinity,
  );
});
