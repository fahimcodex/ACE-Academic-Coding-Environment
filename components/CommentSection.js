"use client";

// components/CommentSection.js
// Threaded commenting system for lesson pages
// Supports: posting, upvoting, replying, Markdown code blocks

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import Image from "next/image";
import {
  ThumbsUp,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Code2,
} from "lucide-react";
import Link from "next/link";

// Format Firestore timestamp to relative time
function timeAgo(ts) {
  if (!ts?.seconds) return "just now";
  const diff = Math.floor(Date.now() / 1000 - ts.seconds);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Render comment body — highlight inline `code` and ```blocks```
function CommentBody({ text }) {
  // Split on triple-backtick code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap wrap-break-word">
      {parts.map((part, i) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const code = part.slice(3, -3).trim();
          return (
            <code
              key={i}
              className="block bg-gray-900 border border-white/10 rounded-lg p-3 font-mono text-xs text-green-300 my-2 whitespace-pre overflow-x-auto"
            >
              {code}
            </code>
          );
        }
        // Inline `code`
        const inlineParts = part.split(/(`[^`]+`)/g);
        return inlineParts.map((s, j) =>
          s.startsWith("`") && s.endsWith("`") ? (
            <code
              key={`${i}-${j}`}
              className="bg-gray-800 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono"
            >
              {s.slice(1, -1)}
            </code>
          ) : (
            <span key={`${i}-${j}`}>{s}</span>
          ),
        );
      })}
    </p>
  );
}

// Single comment card (recursive for replies)
function CommentCard({ comment, lessonId, depth = 0 }) {
  const { user } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(true);
  const [replies, setReplies] = useState([]);
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(comment.upvotes ?? 0);
  const [posting, setPosting] = useState(false);

  // Load replies for this comment
  useEffect(() => {
    if (depth >= 2) return; // max 2 levels deep
    const q = query(
      collection(db, "comments"),
      where("lessonId", "==", lessonId),
      where("parentId", "==", comment.id),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeA - timeB; // ascending
        });
        setReplies(data);
      },
      (err) => console.error("Replies onSnapshot error:", err),
    );
    return () => unsub();
  }, [comment.id, lessonId, depth]);

  async function handleUpvote() {
    if (!user || upvoted) return;
    setUpvoted(true);
    setUpvotes((v) => v + 1);
    await updateDoc(doc(db, "comments", comment.id), { upvotes: increment(1) });
  }

  async function postReply() {
    if (!replyText.trim() || !user || posting) return;
    setPosting(true);
    try {
      await addDoc(collection(db, "comments"), {
        lessonId,
        parentId: comment.id,
        userId: user.uid,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        body: replyText.trim(),
        upvotes: 0,
        createdAt: serverTimestamp(),
      });
      setReplyText("");
      setShowReply(false);
    } catch (e) {
      console.error(e);
      alert("Failed to post reply. " + e.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className={`${depth > 0 ? "ml-8 border-l border-white/10 pl-4" : ""}`}>
      <div className="flex gap-3 py-3">
        {/* Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/10">
          {comment.photoURL ? (
            <Image
              src={comment.photoURL}
              alt="avatar"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-xs font-bold">
              {comment.displayName?.[0] ?? "?"}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold">
              {comment.displayName ?? "Anonymous"}
            </span>
            <span className="text-xs text-gray-500">
              {timeAgo(comment.createdAt)}
            </span>
          </div>

          {/* Body */}
          <CommentBody text={comment.body} />

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleUpvote}
              disabled={!user || upvoted}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                upvoted ? "text-blue-400" : "text-gray-500 hover:text-blue-400"
              } disabled:cursor-default`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              {upvotes > 0 && <span>{upvotes}</span>}
            </button>
            {depth < 2 && user && (
              <button
                onClick={() => setShowReply((v) => !v)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Reply
              </button>
            )}
            {replies.length > 0 && (
              <button
                onClick={() => setShowReplies((v) => !v)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="w-3 h-3" /> Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" /> {replies.length} repl
                    {replies.length === 1 ? "y" : "ies"}
                  </>
                )}
              </button>
            )}
          </div>

          {/* Reply input */}
          {showReply && (
            <div className="flex gap-2 mt-3">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && postReply()
                }
                placeholder="Write a reply... (use ```code``` for code blocks)"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />
              <button
                onClick={postReply}
                disabled={!replyText.trim() || posting}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {showReplies &&
        replies.map((reply) => (
          <CommentCard
            key={reply.id}
            comment={reply}
            lessonId={lessonId}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}

// ── Main CommentSection component ─────────────────────────────────────────────
export default function CommentSection({ lessonId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [showTip, setShowTip] = useState(false);

  // Load top-level comments (no parentId)
  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("lessonId", "==", lessonId),
      where("parentId", "==", null),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort by upvotes (desc) then createdAt (desc)
        data.sort((a, b) => {
          if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes;
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
        setComments(data);
      },
      (err) => console.error("Comments onSnapshot error:", err),
    );
    return () => unsub();
  }, [lessonId]);

  async function postComment() {
    if (!newComment.trim() || !user || posting) return;
    setPosting(true);
    try {
      await addDoc(collection(db, "comments"), {
        lessonId,
        parentId: null,
        userId: user.uid,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        body: newComment.trim(),
        upvotes: 0,
        createdAt: serverTimestamp(),
      });
      setNewComment("");
    } catch (e) {
      console.error(e);
      alert("Failed to post comment. " + e.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-400" />
        Discussion
        {comments.length > 0 && (
          <span className="text-sm font-normal text-gray-400">
            ({comments.length} comments)
          </span>
        )}
      </h3>

      {/* New comment input */}
      {user ? (
        <div className="glass rounded-2xl p-4 border border-white/10 mb-6">
          <div className="flex gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="you"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                  {user.displayName?.[0] ?? "?"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && e.ctrlKey && postComment()
                }
                placeholder="Ask a question or share what you learned... (use ```code``` for code blocks)"
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => setShowTip((v) => !v)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <Code2 className="w-3 h-3" /> Formatting tips
                </button>
                <button
                  onClick={postComment}
                  disabled={!newComment.trim() || posting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  {posting ? "Posting..." : "Post"}
                </button>
              </div>
              {showTip && (
                <div className="mt-2 text-xs text-gray-400 bg-white/5 rounded-lg p-3 space-y-1">
                  <p>
                    Use{" "}
                    <code className="text-blue-300 bg-gray-800 px-1 rounded">
                      ```your code here```
                    </code>{" "}
                    for code blocks
                  </p>
                  <p>
                    Use{" "}
                    <code className="text-blue-300 bg-gray-800 px-1 rounded">
                      `inline code`
                    </code>{" "}
                    for inline code
                  </p>
                  <p>
                    Press{" "}
                    <code className="text-blue-300 bg-gray-800 px-1 rounded">
                      Ctrl+Enter
                    </code>{" "}
                    to post
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-5 border border-white/10 mb-6 text-center">
          <p className="text-gray-400 text-sm">
            <Link href="/" className="text-blue-400 hover:underline">
              Sign in
            </Link>{" "}
            to join the discussion.
          </p>
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          No comments yet. Be the first to ask a question!
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              lessonId={lessonId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
