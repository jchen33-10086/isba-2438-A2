"use client";

import { useState } from "react";
import Link from "next/link";

const inputClasses =
  "h-11 rounded-lg border border-zinc-300 px-4 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-zinc-50";

export default function BlogForm() {
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsPending(true);
    setSuccess(false);
    setErrors([]);
    setCreatedSlug(null);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(formData.get("title") ?? ""),
          content: String(formData.get("content") ?? ""),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setCreatedSlug(data.slug);
        form.reset();
      } else {
        setErrors(data.errors ?? ["Something went wrong. Please try again."]);
      }
    } catch {
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Blog post title"
          className={inputClasses}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="text-sm font-medium">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          placeholder="Write your blog post here..."
          className="rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-zinc-50"
        />
      </div>

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
      {success && (
        <div
          role="status"
          className="rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400"
        >
          Blog post published successfully.{" "}
          {createdSlug && (
            <Link
              href={`/blogs/${createdSlug}`}
              className="font-medium underline underline-offset-2"
            >
              View it on the blogs page
            </Link>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Publishing..." : "Publish Post"}
      </button>
    </form>
  );
}
