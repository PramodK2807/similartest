/**
 * TYPE 2 figure: a square frame with a bold diagonal, a half-circle ("bowl")
 * near the middle, an optional line, and three triangles.
 * Drawing area: 74 x 74 (see Figure.jsx for the view box).
 */
const INK = '#1d1d1f';
const PAPER = '#ffffff';
const SIZE = 74;
const BOWL_C = [38, 37];
const R_BOWL = 13;

// where each triangle sits (the lower-left one sits on the diagonal)
const TRI_AT = { ul: [18, 22], ll: [22, 52], lr: [54, 56] };
// direction the bowl bulges towards (SVG degrees: 0 = east, 90 = south)
const BOWL_DIRS = { n: 270, ne: 315, e: 0, se: 45, s: 90, sw: 135, w: 180, nw: 225 };

const rad = (d) => (d * Math.PI) / 180;
const n1 = (n) => Number(n.toFixed(1));
const pts = (list) => list.map(([x, y]) => `${n1(x)},${n1(y)}`).join(' ');
const fillOf = (v) => (v === 'black' ? INK : PAPER);

const THIN = { stroke: INK, strokeWidth: 1.5, strokeLinejoin: 'round', strokeLinecap: 'round' };
const BOLD = { stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round', strokeLinecap: 'round' };

// Triangle with its point facing `angle` degrees.
function triangle([cx, cy], angle, fill) {
  const ux = Math.cos(rad(angle));
  const uy = Math.sin(rad(angle));
  const nx = -uy;
  const ny = ux;
  return {
    type: 'polygon',
    props: {
      points: pts([
        [cx + ux * 10, cy + uy * 10],
        [cx - ux * 5 + nx * 7.5, cy - uy * 5 + ny * 7.5],
        [cx - ux * 5 - nx * 7.5, cy - uy * 5 - ny * 7.5],
      ]),
      fill: fillOf(fill),
      ...THIN,
    },
  };
}

export function figureShapes2(spec) {
  const shapes = [];

  // frame and its bold diagonal
  shapes.push({ type: 'rect', props: { x: 0, y: 0, width: SIZE, height: SIZE, fill: PAPER, ...BOLD } });
  shapes.push({ type: 'line', props: { x1: 0, y1: SIZE, x2: SIZE, y2: 0, ...BOLD } });

  // line running from the upper-left triangle to the lower-right one
  if (spec.shaft === 'on') {
    shapes.push({
      type: 'line',
      props: { x1: TRI_AT.ul[0], y1: TRI_AT.ul[1], x2: TRI_AT.lr[0], y2: TRI_AT.lr[1], ...THIN },
    });
  }

  // half-circle bulging towards spec.bowl, flat side through the centre
  const [cx, cy] = BOWL_C;
  const b = BOWL_DIRS[spec.bowl];
  const p1 = [cx + R_BOWL * Math.cos(rad(b - 90)), cy + R_BOWL * Math.sin(rad(b - 90))];
  const p2 = [cx + R_BOWL * Math.cos(rad(b + 90)), cy + R_BOWL * Math.sin(rad(b + 90))];
  shapes.push({
    type: 'path',
    props: {
      d: `M${n1(p1[0])} ${n1(p1[1])}A${R_BOWL} ${R_BOWL} 0 0 1 ${n1(p2[0])} ${n1(p2[1])}Z`,
      fill: PAPER,
      ...THIN,
    },
  });

  shapes.push(triangle(TRI_AT.ul, spec.ulDir, spec.ulFill));
  shapes.push(triangle(TRI_AT.ll, spec.llDir, spec.llFill));
  shapes.push(triangle(TRI_AT.lr, spec.lrDir, spec.lrFill));

  return shapes;
}