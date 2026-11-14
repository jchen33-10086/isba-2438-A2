import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";

export const instant = false;

type BlogPost = {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
};

async function readPosts(): Promise<BlogPost[]> {
  const dataFile = path.join(process.cwd(), "data", "blogs.json");
  try {
    return JSON.parse(await fs.readFile(dataFile, "utf8")) as BlogPost[];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const posts = await readPosts();
  const post = posts.find((post) => post.slug === slug);
  if (!post) {
    return { title: "Blog Post Not Found" };
  }
  return { title: post.title };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blogs/[slug]">) {
  const { slug } = await params;
  const posts = await readPosts();
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <Link
        href="/blogs"
        className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        &larr; Back to Blogs
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      <time className="mt-2 block text-sm text-zinc-500 dark:text-zinc-500">
        {new Date(post.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <div className="mt-8 flex max-w-2xl flex-col gap-4 leading-7 text-zinc-600 dark:text-zinc-400">
        {post.content
          .split("\n")
          .filter((paragraph) => paragraph.trim().length > 0)
          .map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
      </div>
    </section>
  );
}
