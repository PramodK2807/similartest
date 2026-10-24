/**
 * Turns a figure object into a list of SVG shapes (drawing area 120 x 115).
 *
 * The figure follows the reference pictures:
 *  - a black square at the top-left (tilted or flat)
 *  - a big circle holding a tilted diamond, a short curve and a dot
 *  - three outer arcs: left and right ones end in an open arrow head,
 *    the top one runs into a triangle (black or white)
 *  - one more triangle on the right (black or white, pointing left or right)
 */
const INK = "#1d1d1f";
const PAPER = "#ffffff";
const CX = 58;
const CY = 60;
const R_CIRCLE = 32;
const R_ARC = 53;
const R_CURVE = 12;
const DIAMOND_R = 12; // distance from the diamond centre to a corner
const SHIFT = 13; // how far the diamond moves from the circle centre

const DIAMOND_POS = {
  c: [0, 0],
  l: [-SHIFT, 0],
  r: [SHIFT, 0],
  u: [0, -SHIFT],
  d: [0, SHIFT],
};
const BULGE = { r: 0, d: 90, l: 180, u: 270 }; // which way the inner curve bulges

const rad = (d) => (d * Math.PI) / 180;
const on = (r, deg, cx = CX, cy = CY) => [
  cx + r * Math.cos(rad(deg)),
  cy + r * Math.sin(rad(deg)),
];
const n1 = (n) => Number(n.toFixed(1));
const pts = (list) => list.map(([x, y]) => `${n1(x)},${n1(y)}`).join(" ");
const fillOf = (v) => (v === "black" ? INK : PAPER);

const STROKE = {
  stroke: INK,
  strokeWidth: 1.6,
  strokeLinejoin: "round",
  strokeLinecap: "round",
};

// Open "V" arrow head on the big arc at angle `deg`. dir 1 = clockwise, -1 = anticlockwise.
function openHead(deg, dir) {
  const [x, y] = on(R_ARC, deg);
  const t = rad(deg);
  const tx = -Math.sin(t) * dir;
  const ty = Math.cos(t) * dir;
  const barb = (a) => {
    const c = Math.cos(rad(a));
    const s = Math.sin(rad(a));
    return [x - (tx * c - ty * s) * 9, y - (tx * s + ty * c) * 9];
  };
  return {
    type: "polyline",
    props: {
      points: pts([barb(28), [x, y], barb(-28)]),
      fill: "none",
      ...STROKE,
    },
  };
}

// Arc from `from` to `to` degrees (clockwise), optionally with an arrow head.
function bigArc(from, to, head) {
  const [ax, ay] = on(R_ARC, from);
  const [bx, by] = on(R_ARC, to);
  const shapes = [
    {
      type: "path",
      props: {
        d: `M${n1(ax)} ${n1(ay)}A${R_ARC} ${R_ARC} 0 0 1 ${n1(bx)} ${n1(by)}`,
        fill: "none",
        ...STROKE,
      },
    },
  ];
  if (head === "end") shapes.push(openHead(to, 1));
  if (head === "start") shapes.push(openHead(from, -1));
  return shapes;
}

export function figureShapes(spec) {
  const shapes = [];

  // black square, top-left
  shapes.push({
    type: "rect",
    props: {
      x: -6.5,
      y: -6.5,
      width: 13,
      height: 13,
      transform: `translate(41.5 11) rotate(${spec.sqTilt === "tilt" ? 30 : 0})`,
      fill: INK,
      ...STROKE,
    },
  });

  // left arc, top arc (runs into a triangle), right arc
  shapes.push(...bigArc(175, 235, spec.leftHead));
  shapes.push(...bigArc(270, 308, null));
  shapes.push(...bigArc(0, 58, spec.rightHead));

  // triangle at the end of the top arc
  const up = spec.endDir === "up";
  shapes.push({
    type: "polygon",
    props: {
      points: up
        ? pts([
            [95, 15],
            [103, 31],
            [87, 31],
          ])
        : pts([
            [95, 31],
            [103, 15],
            [87, 15],
          ]),
      fill: fillOf(spec.endFill),
      ...STROKE,
    },
  });

  // triangle on the right
  const right = spec.sideDir === "R";
  shapes.push({
    type: "polygon",
    props: {
      points: right
        ? pts([
            [95, 34],
            [95, 50],
            [111, 42],
          ])
        : pts([
            [110, 34],
            [110, 50],
            [94, 42],
          ]),
      fill: fillOf(spec.sideFill),
      ...STROKE,
    },
  });

  // big circle
  shapes.push({
    type: "circle",
    props: { cx: CX, cy: CY, r: R_CIRCLE, fill: "none", ...STROKE },
  });

  // tilted diamond that can sit centre / left / right / up / down
  const [dx, dy] = DIAMOND_POS[spec.diamondPos];
  const mx = CX + dx;
  const my = CY + dy;
  const corners = [0, 1, 2, 3].map((k) =>
    on(DIAMOND_R, spec.diamondTilt + 45 + 90 * k, mx, my),
  );
  shapes.push({
    type: "polygon",
    props: { points: pts(corners), fill: "none", ...STROKE },
  });

  // short curve bulging up / right / down / left, with a dot on its bulge
  const b = BULGE[spec.curve];
  const ccx = mx - R_CURVE * Math.cos(rad(b));
  const ccy = my - R_CURVE * Math.sin(rad(b));
  const [s1x, s1y] = on(R_CURVE, b - 75, ccx, ccy);
  const [s2x, s2y] = on(R_CURVE, b + 75, ccx, ccy);
  shapes.push({
    type: "path",
    props: {
      d: `M${n1(s1x)} ${n1(s1y)}A${R_CURVE} ${R_CURVE} 0 0 1 ${n1(s2x)} ${n1(s2y)}`,
      fill: "none",
      ...STROKE,
    },
  });
  shapes.push({ type: "circle", props: { cx: mx, cy: my, r: 2.8, fill: INK } });

  return shapes;
}
