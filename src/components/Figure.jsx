// import { createElement, memo } from "react";
// import { figureShapes } from "../utils/figureShapes.js";

// function Figure({ spec, size = 100 }) {
//   return (
//     <svg
//       className="figure"
//       viewBox="0 0 120 115"
//       width={size}
//       height={(size * 115) / 120}
//       aria-hidden="true"
//       focusable="false"
//     >
//       {figureShapes(spec).map((shape, i) =>
//         createElement(shape.type, { key: i, ...shape.props }),
//       )}
//     </svg>
//   );
// }

// export default memo(Figure);
import { createElement, memo } from "react";
import { figureShapes } from "../utils/figureShapes.js";
import { figureShapes2 } from "../utils/figureShapes2.js";

function Figure({ spec, size = 100 }) {
  const type2 = spec.kind === "type2";
  const shapes = type2 ? figureShapes2(spec) : figureShapes(spec);
  return (
    <svg
      className="figure"
      viewBox={type2 ? "-2 -2 78 78" : "0 0 120 115"}
      width={size}
      height={type2 ? size : (size * 115) / 120}
      aria-hidden="true"
      focusable="false"
    >
      {shapes.map((shape, i) =>
        createElement(shape.type, { key: i, ...shape.props }),
      )}
    </svg>
  );
}

export default memo(Figure);
