import React, { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import * as THREE from "three";
import "./style/editor3d.css";

const DEFAULT_FILES = {
  "game.js": `import { Player } from "./player.js";\n\nconst player = new Player();\nconsole.log(\"Game started\", player);`,
  "player.js": `export class Player {\n  constructor() {\n    this.position = { x: 0, y: 0.5, z: 0 };\n    this.color = \"#00ff88\";\n    this.scale = 1;\n  }\n}`,
  "script.js": `// Script window: write automation or helper logic here\nconsole.log(\"Script ready\");`
};

async function storeApi(path = "", options = {}) {
  const res = await fetch(`/api/store${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Store API error");
  return data;
}

export default function Editor3D() {
  const [files, setFiles] = useState(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState("game.js");
  const [scriptCode, setScriptCode] = useState(DEFAULT_FILES["script.js"]);
  const [consoleLines, setConsoleLines] = useState([]);
  const [status, setStatus] = useState("Ready");
  const [projectName, setProjectName] = useState("My ELGE Game");
  const [projectDescription, setProjectDescription] = useState("A game built with the ELGE editor.");
  const [activeTab, setActiveTab] = useState("files");

  const canvasMountRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const cubeRef = useRef(null);

  const activeCode = files[activeFile] || "";
  const fileNames = useMemo(() => Object.keys(files), [files]);

  useEffect(() => {
    if (!canvasMountRef.current || rendererRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e1a);

    const camera = new THREE.PerspectiveCamera(65, canvasMountRef.current.clientWidth / 260, 0.1, 1000);
    camera.position.set(2, 2, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasMountRef.current.clientWidth, 260);
    canvasMountRef.current.appendChild(renderer.domElement);

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x00ff88 })
    );
    scene.add(cube);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshStandardMaterial({ color: 0x1a2332, side: THREE.DoubleSide })
    );
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -0.5;
    scene.add(plane);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(3, 4, 2);
    scene.add(dir);

    const frame = () => {
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      if (rendererRef.current) rendererRef.current._frame = requestAnimationFrame(frame);
    };

    rendererRef.current = renderer;
    cameraRef.current = camera;
    sceneRef.current = scene;
    cubeRef.current = cube;
    frame();

    const onResize = () => {
      if (!canvasMountRef.current || !rendererRef.current || !cameraRef.current) return;
      const width = canvasMountRef.current.clientWidth;
      rendererRef.current.setSize(width, 260);
      cameraRef.current.aspect = width / 260;
      cameraRef.current.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rendererRef.current?._frame) cancelAnimationFrame(rendererRef.current._frame);
      rendererRef.current?.dispose();
      rendererRef.current = null;
      if (canvasMountRef.current) canvasMountRef.current.innerHTML = "";
    };
  }, []);

  function pushConsole(line) {
    setConsoleLines((prev) => [...prev.slice(-79), `[${new Date().toLocaleTimeString()}] ${line}`]);
  }

  async function runCurrentCode() {
    setStatus("Running file...");
    try {
      const blob = new Blob([activeCode], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      const mod = await import(/* @vite-ignore */ url);
      URL.revokeObjectURL(url);

      if (mod?.Player && cubeRef.current) {
        const player = new mod.Player();
        const { x = 0, y = 0.5, z = 0 } = player.position || {};
        const scale = Number(player.scale) || 1;
        cubeRef.current.position.set(x, y, z);
        cubeRef.current.scale.set(scale, scale, scale);
        if (player.color) cubeRef.current.material.color.set(player.color);
        pushConsole(`Applied Player from ${activeFile}`);
      } else {
        pushConsole(`Executed ${activeFile}`);
      }
      setStatus("Run successful");
    } catch (error) {
      setStatus("Run failed");
      pushConsole(`Error: ${error.message}`);
    }
  }

  function runScriptWindow() {
    try {
      const runner = new Function("log", scriptCode);
      runner((...args) => pushConsole(args.map((entry) => String(entry)).join(" ")));
      setStatus("Script executed");
    } catch (error) {
      setStatus("Script failed");
      pushConsole(`Script error: ${error.message}`);
    }
  }

  function addFile() {
    const name = window.prompt("New file name (example: enemy.js)");
    if (!name) return;
    if (files[name]) {
      setStatus("File already exists");
      return;
    }
    const cleanName = name.endsWith(".js") ? name : `${name}.js`;
    setFiles((prev) => ({ ...prev, [cleanName]: "// New ELGE file\n" }));
    setActiveFile(cleanName);
  }

  function updateActiveFile(value = "") {
    setFiles((prev) => ({ ...prev, [activeFile]: value }));
  }

  async function publishGame() {
    setStatus("Publishing...");
    try {
      const payload = {
        name: projectName,
        description: projectDescription,
        files,
        script: scriptCode
      };
      const result = await storeApi("/publish", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setStatus(result?.repoCommitted ? "Published + repo commit requested" : "Published to ELGE_STORE");
      pushConsole(`Published game id: ${result.game?.id || "unknown"}`);
      if (result.warning) pushConsole(result.warning);
    } catch (error) {
      setStatus("Publish failed");
      pushConsole(`Publish error: ${error.message}`);
    }
  }

  return (
    <div className="editor-container">
      <header className="editor-toolbar">
        <div className="editor-brand">
          <span className="editor-logo">🎮</span>
          <span className="editor-title">ELGE Full Editor</span>
        </div>
        <div className="editor-actions">
          <button className="toolbar-btn" type="button" onClick={runCurrentCode}>▶ Run File</button>
          <button className="toolbar-btn" type="button" onClick={runScriptWindow}>⚙ Run Script</button>
          <button className="toolbar-btn primary" type="button" onClick={publishGame}>🚀 Publish Game</button>
        </div>
      </header>

      <div className="editor-layout">
        <aside className="editor-sidebar">
          <div className="explorer-tabs">
            <button className={activeTab === "files" ? "active" : ""} onClick={() => setActiveTab("files")} type="button">Files</button>
            <button className={activeTab === "script" ? "active" : ""} onClick={() => setActiveTab("script")} type="button">Scripting</button>
          </div>
          <div className="explorer-content">
            {activeTab === "files" ? (
              <>
                <div className="tree-header">Project Files</div>
                <div className="file-tree">
                  {fileNames.map((name) => (
                    <button key={name} type="button" className={`file-item ${activeFile === name ? "active" : ""}`} onClick={() => setActiveFile(name)}>
                      <span className="file-icon">📄</span>
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
                <button className="add-file-btn" type="button" onClick={addFile}>+ Add file</button>
              </>
            ) : (
              <div>
                <div className="tree-header">Script Window</div>
                <p className="status-line">Run helper code and logging scripts for your game.</p>
              </div>
            )}
          </div>
        </aside>

        <section className="editor-main">
          <div className="editor-split">
            <div className="code-editor-pane">
              <div className="code-editor-header">Coding Window — {activeFile}</div>
              <Editor
                height="100%"
                theme="vs-dark"
                language="javascript"
                path={activeFile}
                value={activeCode}
                onChange={updateActiveFile}
                options={{ minimap: { enabled: false }, fontSize: 14 }}
              />
            </div>

            <div className="code-editor-pane">
              <div className="code-editor-header">Scripting Window — script.js</div>
              <Editor
                height="100%"
                theme="vs-dark"
                language="javascript"
                path="script.js"
                value={scriptCode}
                onChange={(value) => setScriptCode(value || "")}
                options={{ minimap: { enabled: false }, fontSize: 14 }}
              />
            </div>
          </div>

          <div className="editor-console">
            <strong>Console</strong>
            <pre>{consoleLines.join("\n") || "No logs yet."}</pre>
          </div>
        </section>

        <aside className="editor-properties">
          <div className="tree-header">Project</div>
          <label>
            Game name
            <input value={projectName} onChange={(event) => setProjectName(event.target.value)} />
          </label>
          <label>
            Description
            <textarea rows={4} value={projectDescription} onChange={(event) => setProjectDescription(event.target.value)} />
          </label>

          <div className="preview-card">
            <div className="tree-header">Live 3D Preview</div>
            <div ref={canvasMountRef} style={{ width: "100%", height: 260, borderRadius: 8, overflow: "hidden" }} />
          </div>

          <p className="status-line">Status: {status}</p>
        </aside>
      </div>
    </div>
  );
}
