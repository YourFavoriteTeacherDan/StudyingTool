import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style/forumsv2.css";

const FALLBACK_AVATAR = "https://api.dicebear.com/9.x/bottts/svg?seed=ModditDev";

export default function Moddit({ profile }) {
  const [mods, setMods] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [game, setGame] = useState("");
  const [image, setImage] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [status, setStatus] = useState("");
  const [isUploadCollapsed, setIsUploadCollapsed] = useState(false);

  async function loadMods() {
    try {
      const response = await fetch("/api/moddit");
      if (!response.ok) return;
      const data = await response.json();
      setMods(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load mods", error);
    }
  }

  useEffect(() => {
    loadMods();
  }, []);

  async function handlePublish(event) {
    event.preventDefault();
    setStatus("");

    const payload = {
      title: title.trim(),
      description: description.trim(),
      game: game.trim(),
      image: image.trim(),
      downloadLink: downloadLink.trim(),
      authorId: profile?.uid || "anonymous-user",
      authorName: profile?.username || "Anonymous Developer",
      authorPicture: profile?.profilePicture || ""
    };

    if (!payload.title || !payload.description || !payload.game || !payload.downloadLink) {
      setStatus("Title, description, game, and download link are required.");
      return;
    }

    try {
      const response = await fetch("/api/moddit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus(data?.error || "Failed to publish mod");
        return;
      }

      setTitle("");
      setDescription("");
      setGame("");
      setImage("");
      setDownloadLink("");
      setStatus("Mod published successfully.");
      await loadMods();
    } catch (error) {
      setStatus(error.message || "Failed to publish mod");
    }
  }

  return (
    <section className="forums-v2-page">
      <div className="forums-v2-shell">
        <header className="forums-v2-header">
          <div>
            <h1>Moddit</h1>
            <p>Developer upload platform for game mods.</p>
          </div>
          <div className="forums-v2-count">{mods.length} mods</div>
        </header>

        <div className="forums-v2-composer-shell">
          <button
            type="button"
            className="forums-v2-collapse-side"
            aria-label={isUploadCollapsed ? "Expand mod upload bar" : "Minimize mod upload bar"}
            onClick={() => setIsUploadCollapsed((prev) => !prev)}
          >
            {isUploadCollapsed ? "▼" : "▲"}
          </button>

          {!isUploadCollapsed && (
            <form onSubmit={handlePublish} className="forums-v2-composer">
              <label htmlFor="mod-title">Mod Title</label>
              <input id="mod-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} />

              <label htmlFor="mod-game">Game</label>
              <input id="mod-game" value={game} onChange={(event) => setGame(event.target.value)} maxLength={80} placeholder="e.g. Eaglercraft 1.8" />

              <label htmlFor="mod-description">Description</label>
              <textarea id="mod-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={4} maxLength={800} />

              <label htmlFor="mod-image">Image URL (optional)</label>
              <input id="mod-image" value={image} onChange={(event) => setImage(event.target.value)} />

              <label htmlFor="mod-download">Download Link (required)</label>
              <input id="mod-download" value={downloadLink} onChange={(event) => setDownloadLink(event.target.value)} placeholder="https://..." required />

              {status && <p className="moddit-status">{status}</p>}
              <button type="submit">Upload Mod</button>
            </form>
          )}
        </div>

        <div className="forums-v2-list">
          {mods.length === 0 && <div className="forums-v2-empty">No mods uploaded yet.</div>}
          {mods.map((mod) => (
            <article key={mod.id} className="forums-v2-card">
              <div className="forums-v2-author">
                <Link to={`/users/${mod.authorId || "anonymous-user"}`}>
                  <img src={mod.authorPicture || FALLBACK_AVATAR} alt={mod.authorName || "Developer"} />
                </Link>
                <div>
                  <p className="forums-v2-author-name">{mod.authorName || "Anonymous Developer"}</p>
                  <p className="forums-v2-author-meta">{mod.createdAt ? new Date(mod.createdAt).toLocaleString() : ""}</p>
                </div>
              </div>

              <h3 className="forums-v2-title">{mod.title}</h3>
              <p className="forums-v2-message">{mod.description}</p>
              <p className="forums-v2-author-meta"><strong>Game:</strong> {mod.game}</p>

              {mod.image && <img src={mod.image} alt={mod.title} className="moddit-image" />}

              <div className="forums-v2-inline-actions">
                <a href={mod.downloadLink} target="_blank" rel="noreferrer" className="moddit-download-link">Download</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
