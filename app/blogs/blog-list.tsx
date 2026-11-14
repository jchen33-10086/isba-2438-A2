"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BlogPost = {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) {
          throw new Error("Request failed");
        }
        setPosts((await res.json()) as BlogPost[]);
      } catch {
        setError("Could not load blog posts. Please try again later.");
      }
    }
    load();
  }, []);

  if (error) {
    return (
      <p
        role="alert"
        className="mt-10 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
      >
        {error}
      </p>
    );
  }

  if (posts === null) {
    return <p className="mt-10 text-zinc-600 dark:text-zinc-400">Loading blog posts...</p>;
  }

  if (posts.length === 0) {
    return (
      <p className="mt-10 text-zinc-600 dark:text-zinc-400">
        No blog posts yet. Check back soon!
      </p>
    );
  }

  const sorted = [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mt-10 flex flex-col gap-6">
      {sorted.map((post) => (
        <Link
          key={post.slug}
          href={`/blogs/${post.slug}`}
          className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-6 transition-shadow hover:shadow-md dark:border-zinc-800"
        >
          <h2 className="text-lg font-semibold">{post.title}</h2>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {post.content.length > 160
              ? `${post.content.slice(0, 160)}...`
              : post.content}
          </p>
          <time className="text-xs text-zinc-500 dark:text-zinc-500">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </Link>
      ))}
    </div>
  );
}
