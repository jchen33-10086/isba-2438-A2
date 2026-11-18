import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
};

const sections = [
  {
    href: "/admin/blogs",
    title: "Blog posts",
    description: "Publish, edit, and delete blog posts.",
  },
  {
    href: "/admin/contacts",
    title: "Contact messages",
    description: "Review, edit, and delete contact form submissions.",
  },
  {
    href: "/admin/projects",
    title: "Projects",
    description: "Create, update, and delete portfolio projects.",
  },
  {
    href: "/admin/resources",
    title: "Learning resources",
    description: "Add, update, and delete learning resources.",
  },
];

export default function Admin() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Admin</h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Manage every entity stored in server JSON files. Each section covers
        create, read, update, and delete through its API.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-6 transition-shadow hover:shadow-md dark:border-zinc-800"
          >
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
