"use client";

// components/NotificationBell.js
// Real-time notification bell in the Navbar
// Shows unread count badge and a dropdown list of recent notifications

import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  where,
  limit,
  onSnapshot,
  updateDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import {
  Bell,
  Zap,
  Trophy,
  MessageCircle,
  UserPlus,
  Flame,
  X,
} from "lucide-react";

// Map notification type to icon + color
const NOTIF_STYLES = {
  xp: { icon: Zap, color: "text-yellow-400 bg-yellow-400/10" },
  badge: { icon: Trophy, color: "text-purple-400 bg-purple-400/10" },
  comment: { icon: MessageCircle, color: "text-blue-400   bg-blue-400/10" },
  follow: { icon: UserPlus, color: "text-green-400  bg-green-400/10" },
  streak: { icon: Flame, color: "text-orange-400 bg-orange-400/10" },
  challenge: { icon: Trophy, color: "text-teal-400   bg-teal-400/10" },
};

function timeAgo(isoString) {
  if (!isoString) return "";
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const dropdownRef = useRef(null);

  // ── Real-time listener ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      limit(20),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        data.sort((a, b) =>
          String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")),
        );
        setNotifs(data);
        setUnread(data.filter((n) => !n.read).length);
      },
      (err) => {
        console.error("Notifications listener error:", err);
      },
    );
    return () => unsub();
  }, [user]);

  // ── Close dropdown on outside click ────────────────────────────────────
  useEffect(() => {
    function onClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // ── Mark all as read when opening ──────────────────────────────────────
  async function openDropdown() {
    setOpen((v) => !v);
    if (!open && unread > 0 && user) {
      const batch = writeBatch(db);
      const unreadItems = notifications.filter((n) => !n.read);
      unreadItems.forEach((n) =>
        batch.update(doc(db, "notifications", n.id), { read: true }),
      );
      await batch.commit();
    }
  }

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={openDropdown}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 glass rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <p className="font-semibold text-sm">Notifications</p>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => {
                const style = NOTIF_STYLES[notif.type] ?? NOTIF_STYLES.xp;
                const Icon = style.icon;
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                      !notif.read ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${style.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white leading-snug">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-white/10 text-center">
              <p className="text-xs text-gray-500">
                Showing last 20 notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
