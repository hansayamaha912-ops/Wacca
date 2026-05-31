import { j as jsxRuntimeExports } from "./server-build-CUDu7COk.js";
import "stream";
import "util";
import "@shopify/remix-oxygen";
import "@shopify/hydrogen";
function HeroScene() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#050a05",
    position: "relative"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      textAlign: "center",
      color: "#00ff41",
      fontFamily: "monospace"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "100px",
        height: "100px",
        margin: "0 auto 20px",
        border: "2px solid #00ff41",
        borderRadius: "50%",
        animation: "pulse 2s ease-in-out infinite"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
        fontSize: "14px",
        letterSpacing: "0.2em",
        textTransform: "uppercase"
      }, children: "WACCA 3D EXPERIENCE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
        fontSize: "10px",
        color: "#8B8B9E",
        marginTop: "8px"
      }, children: "[ LIGHTWEIGHT MODE ]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                }
            ` })
  ] });
}
export {
  HeroScene as default
};
