import { useEffect, useState } from "react";

export default function CommentSectionV2({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const loadComments = () => {
    fetch(`/api/forums_v2/${postId}/comments`)
      .then(res => res.json())
      .then(setComments)
      .catch(console.error);
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleSubmit = async () => {
    await fetch(`/api/forums_v2/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        authorId: "demo-user",
        authorName: "Demo User"
      })
    });

    setContent("");
    loadComments();
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="bg-zinc-900 p-4 rounded-xl">
            <div className="text-sm text-zinc-400">
              {comment.authorName} • {new Date(comment.createdAt).toLocaleString()}
            </div>
            <p className="mt-2 text-zinc-300">{comment.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full bg-zinc-800 rounded-lg p-3 text-white"
          placeholder="Write a comment..."
        />
        <button
          onClick={handleSubmit}
          className="mt-3 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
}
