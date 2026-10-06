import { test } from "node:test";
import assert from "node:assert/strict";
import {
  deliveryFrame,
  entranceFrame,
  cafeTables,
  tableVisitFrame,
} from "./delivery.ts";
const frame = (seconds: number) => deliveryFrame((seconds / 48) * 8, 8, 120);
const visit = (seconds: number, index = 0) =>
  tableVisitFrame((seconds / 48) * 8, 8, 120, index);
test("groups drink, leave, clear the table and are replaced before next service", () => {
  assert.equal(visit(5).phase, "drinking");
  assert.equal(visit(8).phase, "leaving");
  assert.equal(visit(8).served, false);
  assert.equal(visit(9.2).phase, "empty");
  assert.equal(visit(9.2).people.length, 0);
  assert.equal(visit(11).phase, "arriving");
  assert.equal(visit(13).phase, "waiting");
  assert.equal(visit(13).group, 1);
  assert.equal(visit(13).people.length, 2);
  assert.equal(visit(23).phase, "drinking");
  assert.equal(visit(23).group, 1);
  assert.notEqual(visit(13).people[0].shirt, visit(5).people[0].shirt);
});
test("turnover is staggered and every delivery has a seated group", () => {
  for (let table = 0; table < 3; table++) {
    for (let round = 0; round < 2; round++) {
      const servedAt = 0.4 + table * 6 + 3.7 + round * 18;
      assert.equal(visit(servedAt + 0.01, table).phase, "drinking");
      assert.equal(visit(servedAt + 0.01, table).people.length, 2);
    }
  }
  assert.notEqual(visit(8, 0).phase, visit(8, 1).phase);
  assert.deepEqual(visit(11), visit(11));
  assert.equal(visit(0).group, 0);
});
test("entrance customers leave the queue and sit together before their table is served", () => {
  assert.equal(entranceFrame(0, 8).ordering, true);
  const arrived = entranceFrame((4 / 48) * 8, 8);
  assert.equal(arrived.seated, true);
  assert.equal(arrived.ordering, false);
  assert.equal(arrived.people.length, 2);
  assert.equal(arrived.people[0].x, cafeTables[1].x - 39);
  assert.equal(arrived.people[1].x, cafeTables[1].x + 24);
  assert.equal(frame(11).served[1], true);
});
test("pickup keeps the server outside the counter and transfers drinks to the tray", () => {
  const pickup = frame(2.1);
  assert.ok(pickup.x > 728);
  assert.equal(pickup.flip, true);
  assert.ok(
    pickup.handoff !== null && pickup.handoff > 0 && pickup.handoff < 1,
  );
  for (let seconds = 1.15; seconds < 2.8; seconds += 0.025) {
    const pose = frame(seconds);
    assert.ok(pose.x >= 735, `server entered the counter at ${seconds}`);
  }
});
test("waits for production, then shows counter cup, pickup, delivery and empty return", () => {
  assert.equal(frame(0).phase, "waiting");
  assert.equal(frame(0.5).counterCup, true);
  assert.equal(frame(2.1).phase, "pickup");
  assert.equal(frame(2.1).carrying, true);
  assert.equal(frame(2.1).counterCup, false);
  assert.equal(frame(3).phase, "carrying");
  assert.equal(frame(4.3).phase, "delivered");
  assert.equal(frame(4.3).carrying, false);
  assert.equal(frame(4.3).served[0], true);
  assert.equal(frame(5).phase, "returning");
});
test("cycles through three tables and preserves drinks at previously served tables", () => {
  assert.equal(frame(7).tableIndex, 1);
  assert.equal(frame(13).tableIndex, 2);
  assert.equal(frame(19).tableIndex, 0);
  assert.deepEqual(frame(17).served, [true, true, true]);
});
test("pause freezes the entire visual frame and replay clears service", () => {
  assert.deepEqual(frame(3), frame(3));
  assert.deepEqual(frame(0).served, [false, false, false]);
  assert.equal(frame(0).carrying, false);
});
test("short and long shifts share the same visual time scale", () => {
  assert.deepEqual(deliveryFrame(2, 4, 120), deliveryFrame(6, 12, 120));
  assert.equal(deliveryFrame(3, 8, 1).phase, "waiting");
});
