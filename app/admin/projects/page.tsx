import type { Metadata } from "next";
import { connection } from "next/server";
import { readProjects } from "../../lib/entities";
import ProjectManager from "./project-manager";

export const instant = false;

export const metadata: Metadata = {
  title: "Manage Projects",
};

export default async function AdminProjects() {
  await connection();
  const projects = await readProjects();

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Manage Projects
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Create, update, and delete portfolio projects. Data is saved to a
        server JSON file via /api/projects.
      </p>
      <div className="mt-10 max-w-xl">
        <ProjectManager initialProjects={projects} />
      </div>
    </section>
  );
}
