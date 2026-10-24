/**
 * Turns a figure object into a list of SVG shapes.
 * Kept free of React so it is easy to test and preview.
 */
const INK = '#1d1d1f';
const PAPER = '#ffffff';
const CX = 60;
const CY = 66;
const R_RING = 22;
const R_ARC = 34;
const ARC_START = 150;
const ARC_END = 340;

const SQUARE_POS = { tl: [24, 22], tc: [60, 15] };
const TRI_POS = { tr: [99, 24], br: [97, 106] };

const rad = (d) => (d * Math.PI) / 180;
const pointOn = (r, deg) => [CX + r * Math.cos(rad(deg)), CY + r * Math.sin(rad(deg))];
const n1 = (n) => Number(n.toFixed(1));
const pts = (list) => list.map(([x, y]) => `${n1(x)},${n1(y)}`).join(' ');
const fillOf = (v) => (v === 'black' ? INK : PAPER);

const STROKE = {
  stroke: INK,
  strokeWidth: 1.4,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
};

// Arrow head sitting on the outer arc at angle `deg`.
// dir = 1 points clockwise, dir = -1 points anticlockwise.
function headPoints(deg, dir) {
  const [x, y] = pointOn(R_ARC, deg);
  const t = rad(deg);
  const tx = -Math.sin(t) * dir;
  const ty = Math.cos(t) * dir;
  const nx = -ty;
  const ny = tx;
  return pts([
    [x + tx * 8, y + ty * 8],
    [x - tx * 2 + nx * 4.5, y - ty * 2 + ny * 4.5],
    [x - tx * 2 - nx * 4.5, y - ty * 2 - ny * 4.5],
  ]);
}

export function figureShapes(spec) {
  const shapes = [];

  const [sx, sy] = SQUARE_POS[spec.squarePos];
  shapes.push({
    type: 'rect',
    props: { x: sx - 6, y: sy - 6, width: 12, height: 12, fill: fillOf(spec.square), ...STROKE },
  });

  const [tx, ty] = TRI_POS[spec.triPos];
  shapes.push({
    type: 'polygon',
    props: {
      points: pts([[tx, ty - 7.5], [tx + 7.5, ty + 6], [tx - 7.5, ty + 6]]),
      fill: fillOf(spec.tri),
      ...STROKE,
    },
  });

  shapes.push({ type: 'circle', props: { cx: CX, cy: CY, r: R_RING, fill: 'none', ...STROKE } });
  if (spec.rings === 2) {
    shapes.push({ type: 'circle', props: { cx: CX, cy: CY, r: R_RING - 4.5, fill: 'none', ...STROKE } });
  }

  shapes.push({
    type: 'polygon',
    props: {
      points: pts([[CX, CY - 10], [CX + 10, CY], [CX, CY + 10], [CX - 10, CY]]),
      fill: 'none',
      ...STROKE,
    },
  });

  if (spec.inner === 'dot') {
    shapes.push({ type: 'circle', props: { cx: CX, cy: CY, r: 2.6, fill: INK } });
  } else if (spec.inner === 'cross') {
    shapes.push({
      type: 'path',
      props: { d: `M${CX - 4.5} ${CY}H${CX + 4.5}M${CX} ${CY - 4.5}V${CY + 4.5}`, fill: 'none', ...STROKE },
    });
  } else {
    shapes.push({
      type: 'polygon',
      props: {
        points: pts([[CX, CY - 4.5], [CX + 4.5, CY], [CX, CY + 4.5], [CX - 4.5, CY]]),
        fill: 'none',
        ...STROKE,
      },
    });
  }

  const [ax, ay] = pointOn(R_ARC, ARC_START);
  const [bx, by] = pointOn(R_ARC, ARC_END);
  shapes.push({
    type: 'path',
    props: {
      d: `M${n1(ax)} ${n1(ay)}A${R_ARC} ${R_ARC} 0 1 1 ${n1(bx)} ${n1(by)}`,
      fill: 'none',
      ...STROKE,
    },
  });

  const clockwise = spec.head === 'cw';
  shapes.push({
    type: 'polygon',
    props: {
      points: headPoints(clockwise ? ARC_END : ARC_START, clockwise ? 1 : -1),
      fill: fillOf(spec.headFill),
      ...STROKE,
    },
  });

  return shapes;
}
