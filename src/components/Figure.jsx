import { createElement, memo } from 'react';
import { figureShapes } from '../utils/figureShapes.js';

function Figure({ spec, size = 100 }) {
  return (
    <svg
      className="figure"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      {figureShapes(spec).map((shape, i) => createElement(shape.type, { key: i, ...shape.props }))}
    </svg>
  );
}

export default memo(Figure);
