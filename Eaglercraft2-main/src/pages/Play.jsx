import { useEffect, useState, useRef } from "react";
import { ELGE } from "../elge/master/ELGE.js";
import "./style/play.css";

export default function Play() {
  const canvasRef = useRef(null);
  const [bootStatus, setBootStatus] = useState("Booting Minecraft: Web Edition runtime...");
  const [bootError, setBootError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // ✅ ADD: store minecraft instance
  const minecraftRef = useRef(null);

  const startEngine = async () => {
    try {
      if (!canvasRef.current) {
        throw new Error("Canvas render target not found in DOM.");
      }

      // ✅ KEEP: your ELGE engine (unchanged)
      await ELGE.engine.start(canvasRef.current);

      // ✅ ADD: Load external Minecraft Web Edition properly
      const module = await import(
        "https://ckwebgamingstudios.github.io/Minecraft-Web-Edition/index.js"
      );

      const MinecraftGame =
        module.MinecraftGame || window.MinecraftGame;

      if (!MinecraftGame) {
        throw new Error("MinecraftGame export not found in external index.js");
      }

      // ✅ Prevent duplicate instances
      if (!minecraftRef.current) {
        const game = new MinecraftGame(canvasRef.current);
        game.start();

        minecraftRef.current = game;

        // Optional debug
        window.__MINECRAFT__ = game;
      }

      setBootStatus("Minecraft: Web Edition is ready. Click the canvas to start playing.");
      setBootError(null);

    } catch (error) {
      const errorMsg = error?.message || "Unknown error";
      setBootStatus("Engine failed to start");

      setBootError({
        message: errorMsg,
        details: error?.stack || "",
        isWebGLError: /WebGL|context|graphics|I.show/i.test(errorMsg)
      });
    }
  };

  useEffect(() => {
    startEngine();

    return () => {
      // ✅ KEEP: your ELGE cleanup
      if (ELGE.engine.stop) ELGE.engine.stop();

      // ✅ ADD: stop minecraft safely
      if (minecraftRef.current?.stop) {
        minecraftRef.current.stop();
      }
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    setBootError(null);
    setBootStatus("Attempting to re-initialize hardware context...");

    try {
      // ✅ ADD: reset minecraft instance before retry
      if (minecraftRef.current?.stop) {
        minecraftRef.current.stop();
        minecraftRef.current = null;
      }

      if (ELGE.engine.restart) {
        await ELGE.engine.restart(canvasRef.current);
      } else {
        await startEngine();
      }

      // ✅ IMPORTANT: re-load Minecraft after restart
      await startEngine();

    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <section className="play-page">
      <div className="play-shell">
        <header className="play-header">
          <h1>Minecraft: Web Edition</h1>
          <p className={bootError ? "status-text error" : "status-text"}>
            {bootStatus}
          </p>
        </header>

        {bootError && (
          <div className="play-error-panel">
            <div className="error-header">
              <h3>⚠️ {bootError.isWebGLError ? "Graphics Initialization Failed" : "Engine Error"}</h3>
              <p className="error-message">{bootError.message}</p>
            </div>

            {bootError.isWebGLError && (
              <div className="troubleshooting">
                <h4>Recommended Fixes:</h4>
                <ul>
                  <li><strong>Browser Compatibility:</strong> If using Chrome, try <strong>Firefox</strong>.</li>
                  <li><strong>Drivers:</strong> Ensure your Intel Graphics drivers are updated.</li>
                  <li><strong>Hardware Acceleration:</strong> Enable it in browser settings.</li>
                </ul>
                <div className="gpu-note">
                  <strong>Hardware Note:</strong> Legacy GPU detected. Engine may fallback to software rendering.
                </div>
              </div>
            )}

            <div className="error-actions">
              <button onClick={handleRetry} disabled={isRetrying} className="retry-button">
                {isRetrying ? "Initializing..." : "🔄 Retry Connection"}
              </button>
              <button onClick={() => window.location.reload()} className="reload-button">
                🔁 Hard Reload
              </button>
            </div>

            {bootError.details && (
              <details className="error-details">
                <summary>Technical Trace</summary>
                <pre>{bootError.details}</pre>
              </details>
            )}
          </div>
        )}

        <div className="play-canvas-wrap">
          <canvas
            id="victus-canvas"
            ref={canvasRef}
            className="play-canvas"
          />
        </div>

        <div className="play-console-wrap">
          <label htmlFor="elge-console-input">Developer Console</label>
          <input id="elge-console-input" placeholder="Type /help for commands..." />
        </div>

        <div className="play-help">
          <h2>Controls</h2>
          <div className="controls-grid">
            <span><strong>W/A/S/D</strong> Move</span>
            <span><strong>SPACE</strong> Jump</span>
            <span><strong>MOUSE</strong> Look</span>
            <span><strong>ESC</strong> Menu</span>
          </div>
        </div>
      </div>
    </section>
  );
}
