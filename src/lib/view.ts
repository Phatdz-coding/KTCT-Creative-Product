export type View = "landing" | "game";

export const viewForHash = (hash: string): View =>
  ["#game", "#main", "#what-if"].includes(hash) ? "game" : "landing";
