import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePostV2() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [links, setLinks] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/forums_v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        image,
        links: links.split("\n").filter(Boolean),
        authorId: "demo-user",
        authorName: "Demo User"
      })
    });

    const data = await res.json();
    navigate(`/forums_v2/${data.id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-zinc-800 p-3 rounded-lg mb-4"
        />

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your post (Markdown supported)..."
          className="w-full bg-zinc-800 p-3 rounded-lg mb-4 h-40"
        />

        <input
          value={image}
          onChange={e => setImage(e.target.value)}
          placeholder="Image URL (optional)"
          className="w-full bg-zinc-800 p-3 rounded-lg mb-4"
        />

        <textarea
          value={links}
          onChange={e => setLinks(e.target.value)}
          placeholder="Links (one per line)"
          className="w-full bg-zinc-800 p-3 rounded-lg mb-6"
        />

        <button
          onClick={handleSubmit}
          className="bg-green-600 px-6 py-3 rounded-xl hover:bg-green-500"
        >
          Post
        </button>
      </div>
    </div>
  );
}
