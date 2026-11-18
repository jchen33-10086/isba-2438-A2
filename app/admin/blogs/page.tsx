import type { Metadata } from "next";
import { connection } from "next/server";
import { readBlogs } from "../../lib/entities";
import BlogForm from "./blog-form";
import BlogManager from "./blog-manager";

export const instant = false;

export const metadata: Metadata = {
  title: "Manage Blog Posts",
};

export default async function AdminBlogs() {
  await connection();
  const posts = await readBlogs();

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Manage Blog Posts
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Publish a new blog post, or edit and remove existing ones. Data is
        saved to a server JSON file via /api/blogs.
      </p>
      <div className="mt-10 max-w-xl">
        <BlogForm />
      </div>
      <div className="mt-12 max-w-2xl">
        <BlogManager initialPosts={posts} />
      </div>
    </section>
  );
}
