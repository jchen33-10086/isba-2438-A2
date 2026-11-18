"use client";

import { useCallback, useState } from "react";
import type { Project } from "../../lib/types";

const inputClasses =
  "w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-zinc-50";

const primaryButtonClasses =
  "rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClasses =
  "rounded-full border border-zinc-300 px-5 py-2 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900";

const dangerButtonClasses =
  "rounded-full border border-red-300 px-5 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40";

export default function ProjectManager({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [overview, setOverview] = useState("");
  const [features, setFeatures] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTech, setEditTech] = useState("");
  const [editOverview, setEditOverview] = useState("");
  const [editFeatures, setEditFeatures] = useState("");

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        throw new Error("Request failed");
      }
      setProjects((await res.json()) as Project[]);
    } catch {
      setErrors(["Could not load projects."]);
    }
  }, []);

  async function callApi(
    method: string,
    path: string,
    body?: unknown
  ): Promise<boolean> {
    setPending(true);
    setErrors([]);
    setNotice("");
    try {
      const res = await fetch(path, {
        method,
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { errors?: string[] };
      if (!res.ok) {
        setErrors(data.errors ?? ["Something went wrong. Please try again."]);
        return false;
      }
      return true;
    } catch {
      setErrors(["Something went wrong. Please try again."]);
      return false;
    } finally {
      setPending(false);
    }
  }

  async function addProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = await callApi("POST", "/api/projects", {
      title,
      description,
      tech,
      overview,
      features,
    });
    if (ok) {
      setNotice("Project added.");
      setTitle("");
      setDescription("");
      setTech("");
      setOverview("");
      setFeatures("");
      await reload();
    }
  }

  function startEdit(project: Project) {
    setEditing(project);
    setEditTitle(project.title);
    setEditDescription(project.description);
    setEditTech(project.tech.join(", "));
    setEditOverview(project.overview);
    setEditFeatures(project.features.join("\n"));
    setErrors([]);
    setNotice("");
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) {
      return;
    }
    const ok = await callApi("PUT", `/api/projects/${editing.slug}`, {
      title: editTitle,
      description: editDescription,
      tech: editTech,
      overview: editOverview,
      features: editFeatures,
    });
    if (ok) {
      setNotice("Project updated.");
      setEditing(null);
      await reload();
    }
  }

  async function deleteProject(project: Project) {
    const ok = await callApi("DELETE", `/api/projects/${project.slug}`);
    if (ok) {
      setNotice("Project deleted.");
      if (editing?.slug === project.slug) {
        setEditing(null);
      }
      await reload();
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <p
        role="status"
        aria-live="polite"
        className="min-h-5 text-sm text-zinc-600 dark:text-zinc-400"
      >
        {notice}
      </p>

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

      <form onSubmit={addProject} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Add a project</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="project-title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="project-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="project-description" className="text-sm font-medium">
            Description
          </label>
          <input
            id="project-description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="project-tech" className="text-sm font-medium">
            Tech (comma separated)
          </label>
          <input
            id="project-tech"
            type="text"
            value={tech}
            onChange={(event) => setTech(event.target.value)}
            placeholder="Python, SQL"
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="project-overview" className="text-sm font-medium">
            Overview
          </label>
          <textarea
            id="project-overview"
            rows={3}
            value={overview}
            onChange={(event) => setOverview(event.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="project-features" className="text-sm font-medium">
            Features (one per line)
          </label>
          <textarea
            id="project-features"
            rows={3}
            value={features}
            onChange={(event) => setFeatures(event.target.value)}
            className={inputClasses}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className={`${primaryButtonClasses} self-start`}
        >
          {pending ? "Working..." : "Add Project"}
        </button>
      </form>

      {editing && (
        <form
          onSubmit={saveEdit}
          className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
        >
          <h2 className="text-lg font-semibold">
            Editing &ldquo;{editing.title}&rdquo;
          </h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-project-title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="edit-project-title"
              type="text"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-project-description" className="text-sm font-medium">
              Description
            </label>
            <input
              id="edit-project-description"
              type="text"
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-project-tech" className="text-sm font-medium">
              Tech (comma separated)
            </label>
            <input
              id="edit-project-tech"
              type="text"
              value={editTech}
              onChange={(event) => setEditTech(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-project-overview" className="text-sm font-medium">
              Overview
            </label>
            <textarea
              id="edit-project-overview"
              rows={3}
              value={editOverview}
              onChange={(event) => setEditOverview(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-project-features" className="text-sm font-medium">
              Features (one per line)
            </label>
            <textarea
              id="edit-project-features"
              rows={3}
              value={editFeatures}
              onChange={(event) => setEditFeatures(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className={primaryButtonClasses}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className={secondaryButtonClasses}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div>
        <h2 className="text-lg font-semibold">All projects</h2>
        {projects.length === 0 ? (
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            No projects yet.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {projects.map((project) => (
              <li
                key={project.slug}
                className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <span className="font-semibold">{project.title}</span>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => startEdit(project)}
                    className={secondaryButtonClasses}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProject(project)}
                    className={dangerButtonClasses}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
