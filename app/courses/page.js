"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen, ChevronRight, Zap } from "lucide-react";

const COLOR = {
  green: {
    border: "border-green-500/30",
    bg: "from-green-500/10 to-transparent",
    text: "text-green-400",
    badge: "bg-green-500/10",
  },
  orange: {
    border: "border-orange-500/30",
    bg: "from-orange-500/10 to-transparent",
    text: "text-orange-400",
    badge: "bg-orange-500/10",
  },
  blue: {
    border: "border-blue-500/30",
    bg: "from-blue-500/10 to-transparent",
    text: "text-blue-400",
    badge: "bg-blue-500/10",
  },
  purple: {
    border: "border-purple-500/30",
    bg: "from-purple-500/10 to-transparent",
    text: "text-purple-400",
    badge: "bg-purple-500/10",
  },
};

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const q = query(collection(db, "courses"), orderBy("order"));
      const snap = await getDocs(q);

      const withLessonCounts = await Promise.all(
        snap.docs.map(async (d) => {
          const base = { id: d.id, ...d.data() };
          try {
            const lessonsSnap = await getDocs(
              collection(db, "courses", d.id, "lessons"),
            );
            return { ...base, totalLessons: lessonsSnap.size };
          } catch {
            return base;
          }
        }),
      );

      setCourses(withLessonCounts);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Courses</h1>
          <p className="text-gray-400">
            Choose a language and start your learning path.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {courses.map((course) => {
              const c = COLOR[course.color] ?? COLOR.blue;
              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className={`glass rounded-2xl p-6 border ${c.border} bg-gradient-to-br ${c.bg} card-hover group block`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{course.emoji}</span>
                    <span
                      className={`text-xs font-semibold ${c.text} ${c.badge} px-2 py-1 rounded-full`}
                    >
                      {course.level}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-1">{course.title}</h2>
                  <p className={`text-sm font-medium ${c.text} mb-3`}>
                    {course.tagline}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" /> {course.totalLessons}{" "}
                        lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-yellow-400" />{" "}
                        {course.xpReward} XP/lesson
                      </span>
                    </div>
                    <span
                      className={`flex items-center gap-1 text-sm font-semibold ${c.text} group-hover:gap-2 transition-all`}
                    >
                      Start <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
