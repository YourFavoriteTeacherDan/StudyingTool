import { useNavigate } from "react-router-dom";

export default function PostCardV2({ post }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/forums_v2/${post.id}`)}
      className="bg-zinc-900 rounded-2xl p-6 shadow-lg hover:bg-zinc-800 hover:scale-[1.01] transition cursor-pointer"
    >
      <h2 className="text-xl font-bold text-white">{post.title}</h2>

      <div className="text-sm text-zinc-400 mt-1">
        Posted by {post.authorName} • {new Date(post.createdAt).toLocaleString()}
      </div>

      <p className="text-zinc-300 mt-3 line-clamp-3">
        {post.content}
      </p>

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="rounded-lg mt-4 max-h-96 object-cover w-full"
        />
      )}

      <div className="mt-4 border-t border-zinc-700 pt-3 text-sm text-zinc-400 flex justify-between">
        <span>▲ {post.upvotes}</span>
        <span>{post.commentsCount} comments</span>
      </div>
    </div>
  );
}
