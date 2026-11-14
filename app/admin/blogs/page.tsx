import type { Metadata } from "next";
import BlogForm from "./blog-form";

export const metadata: Metadata = {
  title: "Add a Blog Post",
};

export default function AdminBlogs() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Add a Blog Post
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Publish a new blog post. It is POSTed to /api/blogs and saved to a
        JSON file, then appears on the blogs page.
      </p>
      <div className="mt-10 max-w-xl">
        <BlogForm />
      </div>
    </section>
  );
}
