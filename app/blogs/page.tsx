import type { Metadata } from "next";
import BlogList from "./blog-list";

export const metadata: Metadata = {
  title: "Blog",
};

export default function Blogs() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        All blog posts, fetched from /api/blogs. Click a post to read it.
      </p>
      <BlogList />
    </section>
  );
}
