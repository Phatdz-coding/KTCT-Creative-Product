import { test } from "node:test";
import assert from "node:assert/strict";
import { viewForHash } from "./view.ts";

test("the presentation is the default view and #game opens the simulation", () => {
  assert.equal(viewForHash(""), "landing");
  assert.equal(viewForHash("#gioi-thieu"), "landing");
  assert.equal(viewForHash("#game"), "game");
  assert.equal(viewForHash("#main"), "game");
  assert.equal(viewForHash("#what-if"), "game");
});
