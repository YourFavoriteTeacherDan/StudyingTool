import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style/forumsv2.css";

export default function ForumsV2({ profile }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [commentDrafts, setCommentDrafts] = useState({});
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isComposerCollapsed, setIsComposerCollapsed] = useState(false);

  async function loadMessages() {
    try {
      const response = await fetch("/api/forums");
      if (!response.ok) return;
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load forum messages", error);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function handlePostMessage(event) {
    event.preventDefault();
    const trimmedTitle = newTitle.trim();
    const trimmedContent = newMessage.trim();
    if (!trimmedTitle || !trimmedContent) return;

    try {
      const response = await fetch("/api/forums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          content: trimmedContent,
          authorId: profile?.uid || "anonymous-user",
          authorName: profile?.username || "Anonymous",
          authorPicture: profile?.profilePicture || ""
        })
      });

      if (!response.ok) return;
      setNewTitle("");
      setNewMessage("");
      await loadMessages();
    } catch (error) {
      console.error("Failed to create forum post", error);
    }
  }

  async function handlePostComment(messageId) {
    const draft = commentDrafts[messageId] || "";
    const trimmed = draft.trim();
    if (!trimmed) return;

    try {
      const response = await fetch(`/api/forums/${messageId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: trimmed,
          authorId: profile?.uid || "anonymous-user",
          authorName: profile?.username || "Anonymous",
          authorPicture: profile?.profilePicture || ""
        })
      });

      if (!response.ok) return;

      setCommentDrafts((prev) => ({ ...prev, [messageId]: "" }));
      await loadMessages();
    } catch (error) {
      console.error("Failed to create comment", error);
    }
  }

  function beginEdit(post) {
    setEditingPostId(post.id);
    setEditTitle(post.title || "");
    setEditContent(post.content || post.message || "");
  }

  async function handleSaveEdit(postId) {
    const trimmedTitle = editTitle.trim();
    const trimmedContent = editContent.trim();
    if (!trimmedTitle || !trimmedContent) return;

    try {
      const response = await fetch(`/api/forums/${postId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          content: trimmedContent,
          authorId: profile?.uid || ""
        })
      });

      if (!response.ok) return;
      setEditingPostId(null);
      setEditTitle("");
      setEditContent("");
      await loadMessages();
    } catch (error) {
      console.error("Failed to edit post", error);
    }
  }

  async function handleDeletePost(postId) {
    const confirmed = window.confirm("Delete this post permanently?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/forums/${postId}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: profile?.uid || "" })
      });

      if (!response.ok) return;
      await loadMessages();
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  }

  return (
    <section className="forums-v2-page">
      <div className="forums-v2-shell">
        <header className="forums-v2-header">
          <div>
            <h1>Forums</h1>
            <p>Talk with the community, share updates, and discuss gameplay.</p>
          </div>
          <div className="forums-v2-count">{messages.length} posts</div>
        </header>

        <div className="forums-v2-composer-shell">
          <button
            type="button"
            className="forums-v2-collapse-side"
            aria-label={isComposerCollapsed ? "Expand post upload bar" : "Minimize post upload bar"}
            onClick={() => setIsComposerCollapsed((prev) => !prev)}
          >
            {isComposerCollapsed ? "▼" : "▲"}
          </button>

          {!isComposerCollapsed && (
            <form onSubmit={handlePostMessage} className="forums-v2-composer">
              <label htmlFor="forum-title">Post title</label>
              <input
                id="forum-title"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="Add a short title"
                maxLength={80}
              />
              <label htmlFor="forum-message">Post message</label>
              <textarea
                id="forum-message"
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                placeholder="Share an update, ask a question, or post patch notes..."
                rows={4}
              />
              <button type="submit">Post Message</button>
            </form>
          )}
        </div>

        <div className="forums-v2-list">
          {messages.length === 0 && <div className="forums-v2-empty">No posts yet. Start the first discussion.</div>}

          {messages.map((message) => {
            const isExpanded = expandedMessageId === message.id;
            const comments = Array.isArray(message.comments) ? message.comments : [];
            const isOwner = profile?.uid && message.authorId === profile.uid;
            const isEditing = editingPostId === message.id;

            return (
              <article key={message.id} className="forums-v2-card">
                <div className="forums-v2-author">
                  <Link to={`/users/${message.authorId || "anonymous-user"}`}>
                    <img
                      src={message.authorPicture || "https://api.dicebear.com/9.x/bottts/svg?seed=ForumUser"}
                      alt={message.authorName || "User"}
                    />
                  </Link>
                  <div>
                    <p className="forums-v2-author-name">{message.authorName || "Anonymous"}</p>
                    <p className="forums-v2-author-meta">{message.createdAt ? new Date(message.createdAt).toLocaleString() : ""}</p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="forums-v2-editor">
                    <input value={editTitle} maxLength={80} onChange={(event) => setEditTitle(event.target.value)} />
                    <textarea rows={4} value={editContent} onChange={(event) => setEditContent(event.target.value)} />
                    <div className="forums-v2-inline-actions">
                      <button type="button" onClick={() => handleSaveEdit(message.id)}>Save</button>
                      <button type="button" className="ghost" onClick={() => setEditingPostId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="forums-v2-title">{message.title || "Untitled Post"}</h3>
                    <p className="forums-v2-message">{message.content || message.message || message.title}</p>
                  </>
                )}

                {isOwner && !isEditing && (
                  <div className="forums-v2-inline-actions">
                    <button type="button" onClick={() => beginEdit(message)}>Edit</button>
                    <button type="button" className="danger" onClick={() => handleDeletePost(message.id)}>Delete</button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setExpandedMessageId(isExpanded ? null : message.id)}
                  className="forums-v2-toggle"
                >
                  {isExpanded ? "Hide Comments" : "Show Comments"} ({comments.length})
                </button>

                {isExpanded && (
                  <div className="forums-v2-comments">
                    <div className="forums-v2-comment-list">
                      {comments.length === 0 && <p className="forums-v2-comment-empty">No comments yet.</p>}
                      {comments.map((comment, index) => (
                        <div key={`${message.id}-comment-${index}`} className="forums-v2-comment-item">
                          <div className="forums-v2-comment-author">
                            <Link to={`/users/${comment.authorId || "anonymous-user"}`}>
                              <img
                                src={comment.authorPicture || "https://api.dicebear.com/9.x/bottts/svg?seed=CommentUser"}
                                alt={comment.authorName || "User"}
                              />
                            </Link>
                            <strong>{comment.authorName || "Anonymous"}</strong>
                          </div>
                          <p>{comment.text || comment.content}</p>
                          {comment.timestamp && <time>{new Date(comment.timestamp).toLocaleString()}</time>}
                        </div>
                      ))}
                    </div>

                    <div className="forums-v2-comment-box">
                      <textarea
                        value={commentDrafts[message.id] || ""}
                        onChange={(event) => {
                          const { value } = event.target;
                          setCommentDrafts((prev) => ({ ...prev, [message.id]: value }));
                        }}
                        placeholder="Write a comment..."
                        rows={2}
                      />
                      <button type="button" onClick={() => handlePostComment(message.id)}>
                        Post Comment
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
