"use client";

import { useCallback, useState } from "react";
import ResourceCard from "../../resources/resource-card";
import type { Resource } from "../../lib/types";

const inputClasses =
  "w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-zinc-50";

const primaryButtonClasses =
  "rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClasses =
  "rounded-full border border-zinc-300 px-5 py-2 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900";

type ApiResult = { ok: boolean; data: Record<string, unknown> };

export default function ResourceManager({
  initialResources,
}: {
  initialResources: Resource[];
}) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editTopic, setEditTopic] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/resources");
      if (!res.ok) {
        throw new Error("Request failed");
      }
      setResources((await res.json()) as Resource[]);
    } catch {
      setErrors(["Could not load resources."]);
    }
  }, []);

  async function callApi(
    method: string,
    path: string,
    body?: unknown
  ): Promise<ApiResult> {
    setPending(true);
    setErrors([]);
    setNotice("");
    try {
      const res = await fetch(path, {
        method,
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as {
        errors?: string[];
      };
      if (!res.ok) {
        setErrors(data.errors ?? ["Something went wrong. Please try again."]);
        return { ok: false, data: {} };
      }
      return { ok: true, data: data as Record<string, unknown> };
    } catch {
      setErrors(["Something went wrong. Please try again."]);
      return { ok: false, data: {} };
    } finally {
      setPending(false);
    }
  }

  async function addResource(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await callApi("POST", "/api/resources", { title, url, topic, notes });
    if (result.ok) {
      setNotice("Resource added.");
      setTitle("");
      setUrl("");
      setTopic("");
      setNotes("");
      await reload();
    }
  }

  function startEdit(resource: Resource) {
    setEditing(resource);
    setEditTitle(resource.title);
    setEditUrl(resource.url);
    setEditTopic(resource.topic);
    setEditNotes(resource.notes);
    setErrors([]);
    setNotice("");
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) {
      return;
    }
    const result = await callApi("PUT", `/api/resources/${editing.id}`, {
      title: editTitle,
      url: editUrl,
      topic: editTopic,
      notes: editNotes,
    });
    if (result.ok) {
      setNotice("Resource updated.");
      setEditing(null);
      await reload();
    }
  }

  async function deleteResource(resource: Resource) {
    const result = await callApi("DELETE", `/api/resources/${resource.id}`);
    if (result.ok) {
      setNotice("Resource deleted.");
      if (editing?.id === resource.id) {
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

      <form onSubmit={addResource} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Add a resource</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="resource-title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="resource-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="resource-url" className="text-sm font-medium">
            URL
          </label>
          <input
            id="resource-url"
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="resource-topic" className="text-sm font-medium">
            Topic
          </label>
          <input
            id="resource-topic"
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. SQL"
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="resource-notes" className="text-sm font-medium">
            Notes (optional)
          </label>
          <textarea
            id="resource-notes"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className={inputClasses}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className={`${primaryButtonClasses} self-start`}
        >
          {pending ? "Working..." : "Add Resource"}
        </button>
      </form>

      {editing && (
        <form onSubmit={saveEdit} className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">
            Editing &ldquo;{editing.title}&rdquo;
          </h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-resource-title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="edit-resource-title"
              type="text"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-resource-url" className="text-sm font-medium">
              URL
            </label>
            <input
              id="edit-resource-url"
              type="text"
              value={editUrl}
              onChange={(event) => setEditUrl(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-resource-topic" className="text-sm font-medium">
              Topic
            </label>
            <input
              id="edit-resource-topic"
              type="text"
              value={editTopic}
              onChange={(event) => setEditTopic(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-resource-notes" className="text-sm font-medium">
              Notes
            </label>
            <textarea
              id="edit-resource-notes"
              rows={3}
              value={editNotes}
              onChange={(event) => setEditNotes(event.target.value)}
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
        <h2 className="text-lg font-semibold">All resources</h2>
        {resources.length === 0 ? (
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            No resources yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onEdit={startEdit}
                onDelete={deleteResource}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
