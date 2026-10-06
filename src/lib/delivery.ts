// Visual service cycles use the existing shift clock; no sales or costs are changed.
export const cafeTables = [
  { x: 917, y: 325, shirt: "#a36d50" },
  { x: 350, y: 448, shirt: "#6e8590" },
  { x: 870, y: 448, shirt: "#7d8a60" },
];
// Keep the server's body outside the counter's right edge (x=728).
// Only the drinks cross that edge during the handoff.
const pickup = { x: 735, y: 240 };
const home = { x: 735, y: 290 };
const mix = (a: typeof home, b: typeof home, t: number) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});
export function entranceFrame(hours: number, duration: number) {
  const seconds = (hours / duration) * 48;
  const progress = Math.max(0, Math.min(1, (seconds - 1) / 3));
  const table = cafeTables[1];
  return {
    seated: progress === 1,
    ordering: seconds < 1,
    people: [
      {
        ...mix(
          { x: 197, y: 274 },
          { x: table.x - 39, y: table.y - 65 },
          progress,
        ),
        shirt: "#c18166",
        hair: "#453028",
      },
      {
        ...mix(
          { x: 144, y: 288 },
          { x: table.x + 24, y: table.y - 65 },
          progress,
        ),
        shirt: "#6e8590",
        hair: "#b18350",
      },
    ],
  };
}
function route(points: (typeof home)[], progress: number) {
  const scaled =
    Math.min(0.999999, Math.max(0, progress)) * (points.length - 1);
  const i = Math.floor(scaled);
  return {
    ...mix(points[i], points[i + 1], scaled - i),
    flip: points[i + 1].x < points[i].x,
  };
}
// Tables turn over independently after service. Everything derives from the
// shift clock, so pause, fast-forward and replay need no separate timers.
export function tableVisitFrame(
  hours: number,
  duration: number,
  totalCups: number,
  index: number,
) {
  const seconds = (hours / duration) * 48;
  const firstService = 48 / Math.max(1, totalCups) + index * 6 + 3.7;
  const table = cafeTables[index];
  const stay = 3 + index; // Some groups linger longer than others.
  const elapsed = seconds - firstService;
  const round = Math.max(0, Math.floor(elapsed / 18));
  const age = elapsed < 0 ? -1 : elapsed % 18;
  let phase: "waiting" | "drinking" | "leaving" | "empty" | "arriving" =
    "waiting";
  let progress = 0;
  let group = round;
  if (age >= 0) {
    if (age < stay) phase = "drinking";
    else if (age < stay + 1.8) {
      phase = "leaving";
      progress = (age - stay) / 1.8;
    } else if (age < stay + 2.6) phase = "empty";
    else if (age < stay + 5.2) {
      phase = "arriving";
      progress = (age - stay - 2.6) / 2.6;
      group++;
    } else group++;
  }
  const initialEntrance = index === 1 && seconds < 4;
  if (initialEntrance) phase = "arriving";
  const colors = [
    "#c18166",
    "#6e8590",
    "#7d8a60",
    "#b5a475",
    "#9d7990",
    "#a97948",
  ];
  const people =
    phase === "empty"
      ? []
      : [0, 1].map((person) => {
          const seat = {
            x: table.x + (person === 0 ? -39 : 24),
            y: table.y - 65,
          };
          const door = { x: 48 + person * 38, y: 302 + person * 9 };
          const side = { x: table.x + 80 + person * 17, y: seat.y };
          const corridor = { x: side.x, y: 345 + person * 9 };
          const entry = { x: 200 + person * 28, y: corridor.y };
          let pose = { ...seat, flip: person === 1 };
          if (initialEntrance) {
            const initial = entranceFrame(hours, duration);
            pose = {
              ...initial.people[person],
              flip: initial.seated && person === 1,
            };
          } else if (phase === "leaving")
            pose = route([seat, side, corridor, entry, door], progress);
          else if (phase === "arriving")
            pose = route([door, entry, corridor, side, seat], progress);
          return {
            ...pose,
            shirt: colors[(index * 2 + group * 2 + person) % colors.length],
            hair: (group + person) % 2 ? "#9f734c" : "#453028",
          };
        });
  return {
    phase,
    group,
    people,
    served: phase === "drinking",
    occupied: phase === "waiting" || phase === "drinking",
  };
}
export function deliveryFrame(
  hours: number,
  duration: number,
  totalCups: number,
) {
  const seconds = (hours / duration) * 48;
  const elapsed = Math.max(0, seconds - 48 / Math.max(1, totalCups));
  const started = seconds >= 48 / Math.max(1, totalCups);
  const cycle = Math.floor(elapsed / 6);
  const t = elapsed % 6;
  const tableIndex = cycle % cafeTables.length;
  const table = cafeTables[tableIndex];
  const destination = { x: table.x - 59, y: table.y - 47 };
  const aisle = { x: 745, y: destination.y };
  let position = { ...home, flip: true };
  let phase = "waiting";
  if (started) {
    if (t < 0.7) phase = "ready";
    else if (t < 1.6) {
      phase = "approaching";
      position = route([home, pickup], (t - 0.7) / 0.9);
    } else if (t < 2) {
      phase = "pickup";
      position = { ...pickup, flip: true };
    } else if (t < 3.7) {
      phase = "carrying";
      position =
        t >= 3.5
          ? { ...destination, flip: false }
          : route(
              [pickup, { x: 745, y: 290 }, aisle, destination],
              (t - 2) / 1.5,
            );
    } else if (t < 4.3) {
      phase = "delivered";
      position = { ...destination, flip: false };
    } else {
      phase = "returning";
      position = route([destination, aisle, home], (t - 4.3) / 1.7);
    }
  }
  const served = cafeTables.map(
    (_, i) =>
      started &&
      (cycle > i || (cycle === i && t >= 3.7)) &&
      !(i === tableIndex && t < 3.7),
  );
  return {
    ...position,
    phase,
    tableIndex,
    served,
    carrying: phase === "pickup" || phase === "carrying",
    counterCup: started && t < 1.6,
    handoff: phase === "pickup" ? Math.min(1, (t - 1.6) / 0.4) : null,
    walking: ["approaching", "carrying", "returning"].includes(phase),
    reacting: phase === "delivered" || (phase === "returning" && t < 5.1),
  };
}
