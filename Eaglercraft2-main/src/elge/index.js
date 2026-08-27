import { initInputSystem } from "../elge/core/input/inputManager.js";
import { initPointer } from "../elge/core/input/pointer.js";
import { startTickLoop } from "../elge/core/tickLoop.js";
import { initConsole } from "../elge/console/consoleUI.js";
import { registerDefaultCommands } from "../elge/console/commands.js";

export function start() {
  initInputSystem();
  initPointer();
  initConsole();
  registerDefaultCommands();

  startTickLoop(() => {
    // engine update
  });
}
