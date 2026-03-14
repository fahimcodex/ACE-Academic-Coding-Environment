"use client";

import { useEffect, useState } from "react";
import {
  collection, query, orderBy, limit,
  getDocs, where, doc, getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Zap, Flame, Crown, Medal, ChevronRight } from "lucide-react";
import { levelTitle, levelColor } from "@/lib/gamification";

const TABS   = ["Global", "Python", "Linux", "C", "C++"];
const LIMITS = 50;

// Medal colors for top 3
const RANK_STYLE = {
  1: { icon: Crown,  color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  2: { icon: Medal,  color: "text-gray-300",   bg: "bg-gray-400/10   border-gray-400/30"   },
  3: { icon: Medal,  color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30" },
};

export default function LeaderboardPage() {
  const { user, profile }     = useAuth();
  const [tab,      setTab]    = useState("Global");
  const [entries,  setEntries] = useState([]);
  const [myRank,   setMyRank] = useState(null);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard(tab);
  }, [tab]);

  async function loadLeaderboard(activeTab) {
    setLoading(true);
    try {
      let q;
      if (activeTab === "Global") {
        // Rank all users by total XP
        q = query(
          collection(db, "users"),
          orderBy("xp", "desc"),
          limit(LIMITS)
        );
      } else {
        // Rank by lessons completed in that language
        // We read progress docs and aggregate
        const langId = activeTab.toLowerCase().replace("++", "pp");
        const progSnap = await getDocs(
          query(collection(db, "progress"), where("courseId", "==", langId))
        );

        // Group by userId → count completions
        const counts = {};
        progSnap.docs.forEach(d => {
          const uid = d.data().userId;
          counts[uid] = (counts[uid] ?? 0) + 1;
        });

        // Fetch user docs for those uids
        const uids    = Object.keys(counts).slice(0, LIMITS);
        const users   = await Promise.all(
          uids.map(uid => getDoc(doc(db, "users", uid)))
        );
        const result  = users
          .filter(s => s.exists())
          .map(s => ({ id: s.id, ...s.data(), langLessons: counts[s.id] ?? 0 }))
          .sort((a, b) => b.langLessons - a.langLessons);

        setEntries(result);
        if (user) {
          const idx = result.findIndex(e => e.id === user.uid);
          setMyRank(idx >= 0 ? idx + 1 : null);
        }
        setLoading(false);
        return;
      }

      const snap   = await getDocs(q);
      const result = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setEntries(result);
      if (user) {
        const idx = result.findIndex(e => e.id === user.uid);
        setMyRank(idx >= 0 ? idx + 1 : null);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-gray-400">Top learners ranked by XP and lesson completions.</p>
        </div>

        {/* My rank badge */}
        {user && myRank && (
          <div className="flex items-center gap-3 glass rounded-2xl p-4 border border-blue-500/20 mb-6">
            <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm">
              #{myRank}
            </div>
            <div>
              <p className="text-sm font-semibold">Your current rank</p>
              <p className="text-xs text-gray-400">
                {tab === "Global"
                  ? `${profile?.xp?.toLocaleString() ?? 0} total XP`
                  : `${tab} track`}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 glass rounded-xl p-1 border border-white/10 mb-6 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                tab === t
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="glass rounded-2xl p-10 border border-white/5 text-center text-gray-400">
            No data yet for this track.
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => {
              const rank    = i + 1;
              const isMe    = entry.id === user?.uid;
              const rankCfg = RANK_STYLE[rank];
              const RankIcon = rankCfg?.icon;

              return (
                <Link key={entry.id} href={`/profile/${entry.id}`}
                  className={`flex items-center gap-4 rounded-2xl p-4 border transition-all hover:border-blue-500/30 group ${
                    isMe
                      ? "glass border-blue-500/30 bg-blue-500/5"
                      : rankCfg
                        ? `border ${rankCfg.bg}`
                        : "glass border-white/5 hover:bg-white/[0.02]"
                  }`}>

                  {/* Rank */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                    rankCfg ? `${rankCfg.bg} ${rankCfg.color}` : "bg-white/5 text-gray-400"
                  }`}>
                    {rankCfg
                      ? <RankIcon className="w-4 h-4" />
                      : rank}
                  </div>

                  {/* Avatar */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10">
                    {entry.photoURL ? (
                      <Image src={entry.photoURL} alt="avatar" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                        {entry.displayName?.[0] ?? "?"}
                      </div>
                    )}
                  </div>

                  {/* Name + level */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-semibold truncate ${isMe ? "text-blue-400" : "text-white"}`}>
                        {entry.displayName ?? "Anonymous"}
                        {isMe && <span className="ml-1 text-xs text-blue-400">(you)</span>}
                      </p>
                      <span className={`text-xs px-1.5 py-0.5 rounded bg-white/5 ${levelColor(entry.level ?? 1)}`}>
                        Lv.{entry.level ?? 1} {levelTitle(entry.level ?? 1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        {(entry.xp ?? 0).toLocaleString()} XP
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" />
                        {entry.streak ?? 0}d
                      </span>
                      {tab !== "Global" && entry.langLessons != null && (
                        <span className="text-xs text-gray-400">
                          {entry.langLessons} lessons
                        </span>
                      )}
                    </div>
                  </div>

                  {/* XP score */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-yellow-400">{(entry.xp ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">XP</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
