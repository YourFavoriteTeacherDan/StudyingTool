import { startRuntime } from "../runtime/runtime.js"; // FIXED: Moved to the top

export function start({ context, capabilities }) {
  startRuntime({ context, capabilities });
}
