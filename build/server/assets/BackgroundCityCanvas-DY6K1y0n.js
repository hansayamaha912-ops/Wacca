import { j as jsxRuntimeExports } from "./server-build-DDzO_74Y.js";
import "stream";
import "util";
import "@shopify/remix-oxygen";
import "@shopify/hydrogen";
function BackgroundCityCanvas({ opacity = 0.2 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 pointer-events-none z-0",
      style: {
        opacity,
        mixBlendMode: "screen",
        background: "radial-gradient(ellipse at center, #111 0%, #030303 100%)",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          inset: 0,
          background: `
                    linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px)
                `,
          backgroundSize: "50px 50px"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "300px",
          height: "300px",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(0, 255, 65, 0.1) 0%, transparent 70%)",
          animation: "bgPulse 4s ease-in-out infinite"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes bgPulse {
                    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                }
            ` })
      ]
    }
  );
}
export {
  BackgroundCityCanvas as default
};
