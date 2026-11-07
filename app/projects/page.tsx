import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "./data";

export const metadata: Metadata = {
  title: "My Projects",
};

export default function Projects() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        My Projects
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Explore my recent work. Click a project to see its detail page.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 transition-shadow hover:shadow-md dark:border-zinc-800"
          >
            <h2 className="text-lg font-semibold">{project.title}</h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {project.description}
            </p>
            <ul className="mt-auto flex flex-wrap gap-2">
              {project.tech.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium dark:bg-zinc-900"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </section>
  );
}
