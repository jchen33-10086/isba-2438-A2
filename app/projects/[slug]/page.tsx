import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "../data";

export const instant = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug);
  if (!project) {
    return { title: "Project Not Found" };
  }
  return { title: project.title };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <Link
        href="/projects"
        className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        &larr; Back to Projects
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
        {project.title}
      </h1>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <li
            key={item}
            className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium dark:bg-zinc-900"
          >
            {item}
          </li>
        ))}
      </ul>
      <h2 className="mt-10 text-xl font-semibold">Overview</h2>
      <p className="mt-3 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
        {project.overview}
      </p>
      <h2 className="mt-10 text-xl font-semibold">Features</h2>
      <ul className="mt-3 list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
        {project.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </section>
  );
}
