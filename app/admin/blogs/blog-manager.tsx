"use client";

import { useCallback, useState } from "react";
import type { BlogPost } from "../../lib/types";

const inputClasses =
  "w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-zinc-50";

const primaryButtonClasses =
  "rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClasses =
  "rounded-full border border-zinc-300 px-5 py-2 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900";

const dangerButtonClasses =
  "rounded-full border border-red-300 px-5 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40";

export default function BlogManager({
  initialPosts,
}: {
  initialPosts: BlogPost[];
}) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/blogs");
      if (!res.ok) {
        throw new Error("Request failed");
      }
      setPosts((await res.json()) as BlogPost[]);
    } catch {
      setErrors(["Could not load blog posts."]);
    }
  }, []);

  async function callApi(
    method: string,
    path: string,
    body?: unknown
  ): Promise<boolean> {
    setPending(true);
    setErrors([]);
    setNotice("");
    try {
      const res = await fetch(path, {
        method,
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { errors?: string[] };
      if (!res.ok) {
        setErrors(data.errors ?? ["Something went wrong. Please try again."]);
        return false;
      }
      return true;
    } catch {
      setErrors(["Something went wrong. Please try again."]);
      return false;
    } finally {
      setPending(false);
    }
  }

  function startEdit(post: BlogPost) {
    setEditing(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setErrors([]);
    setNotice("");
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) {
      return;
    }
    const ok = await callApi("PUT", `/api/blogs/${editing.slug}`, {
      title: editTitle,
      content: editContent,
    });
    if (ok) {
      setNotice("Blog post updated.");
      setEditing(null);
      await reload();
    }
  }

  async function deletePost(post: BlogPost) {
    const ok = await callApi("DELETE", `/api/blogs/${post.slug}`);
    if (ok) {
      setNotice("Blog post deleted.");
      if (editing?.slug === post.slug) {
        setEditing(null);
      }
      await reload();
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <p
        role="status"
        aria-live="polite"
        className="min-h-5 text-sm text-zinc-600 dark:text-zinc-400"
      >
        {notice}
      </p>

      {errors.length > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
        >
          <ul className="list-inside list-disc space-y-1">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {editing && (
        <form
          onSubmit={saveEdit}
          className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
        >
          <h2 className="text-lg font-semibold">
            Editing &ldquo;{editing.title}&rdquo;
          </h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-blog-title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="edit-blog-title"
              type="text"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-blog-content" className="text-sm font-medium">
              Content
            </label>
            <textarea
              id="edit-blog-content"
              rows={6}
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className={primaryButtonClasses}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className={secondaryButtonClasses}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div>
        <h2 className="text-lg font-semibold">All blog posts</h2>
        {posts.length === 0 ? (
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            No blog posts yet.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold">{post.title}</span>
                  <time className="text-xs text-zinc-500 dark:text-zinc-500">
                    {new Date(post.createdAt).toLocaleDateString("en-US")}
                  </time>
                </div>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {post.content.length > 140
                    ? `${post.content.slice(0, 140)}...`
                    : post.content}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => startEdit(post)}
                    className={secondaryButtonClasses}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePost(post)}
                    className={dangerButtonClasses}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
