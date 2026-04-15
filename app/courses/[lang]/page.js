"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen, Clock, Zap, ChevronRight, ArrowLeft } from "lucide-react";

export default function CoursePage() {
  const { lang } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const courseSnap = await getDoc(doc(db, "courses", lang));
        const lessonsSnap = await getDocs(
          query(collection(db, "courses", lang, "lessons"), orderBy("order")),
        );
        if (courseSnap.exists()) {
          setCourse({ id: courseSnap.id, ...courseSnap.data() });
        }
        setLessons(lessonsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error loading course details:", error);
      } finally {
        setLoading(false);
      }
    }
    if (lang) {
      load();
    }
  }, [lang]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        Course not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <Link
          href="/courses"
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>

        {/* Course header */}
        <div className="glass rounded-2xl p-8 border border-white/10 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{course.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-gray-400">{course.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400 mt-4">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> {course.totalLessons} lessons
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-400" /> {course.xpReward} XP
              per lesson
            </span>
            <span className="px-2 py-0.5 bg-white/5 rounded-full">
              {course.level}
            </span>
          </div>
        </div>

        {/* Lesson list */}
        <h2 className="text-xl font-bold mb-4">Lessons</h2>
        <div className="space-y-3">
          {lessons.map((lesson, i) => (
            <Link
              key={lesson.id}
              href={`/courses/${lang}/${lesson.id}`}
              className="glass rounded-xl p-5 border border-white/5 hover:border-blue-500/30 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold group-hover:text-blue-400 transition-colors">
                    {lesson.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lesson.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" />{" "}
                      {lesson.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
