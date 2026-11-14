import Link from "next/link";

export default function BlogNotFound() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Blog post not found
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
        The blog post you are looking for does not exist. It may have been
        removed, or the link is incorrect.
      </p>
      <Link
        href="/blogs"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-80"
      >
        Back to Blogs
      </Link>
    </section>
  );
}
