import { useEffect, useState } from "react";

async function storeApi() {
  const res = await fetch("/api/store", { credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Failed to load games");
  return data;
}

export default function Store() {
  const [games, setGames] = useState([]);
  const [status, setStatus] = useState("Loading games...");

  useEffect(() => {
    storeApi()
      .then((data) => {
        setGames(Array.isArray(data.result) ? data.result : []);
        setStatus("");
      })
      .catch((error) => setStatus(error.message || "Unable to load store"));
  }, []);

  return (
    <section className="page-shell" style={{ color: "#e5e7eb" }}>
      <h1>Eaglercraft2 Store</h1>
      {status && <p>{status}</p>}
      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {games.map((game) => (
          <article key={game.id} style={{ border: "1px solid #334155", borderRadius: 8, padding: "1rem", background: "#0f172a" }}>
            <h3>{game.name}</h3>
            <p>{game.description || "No description"}</p>
            <small>{new Date(game.createdAt).toLocaleString()}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
