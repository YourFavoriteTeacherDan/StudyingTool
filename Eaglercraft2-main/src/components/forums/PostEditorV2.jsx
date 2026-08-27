import { useState } from "react";

export default function PostEditorV2({ post, onSave }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSave = () => {
    onSave({ title, content });
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full bg-zinc-800 p-3 rounded-lg mb-4"
      />

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full bg-zinc-800 p-3 rounded-lg h-40"
      />

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
      >
        Save Changes
      </button>
    </div>
  );
}
