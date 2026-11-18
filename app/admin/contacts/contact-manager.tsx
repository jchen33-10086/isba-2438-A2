"use client";

import { useCallback, useState } from "react";
import type { ContactEntry } from "../../lib/types";

const inputClasses =
  "w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-zinc-50";

const primaryButtonClasses =
  "rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClasses =
  "rounded-full border border-zinc-300 px-5 py-2 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900";

const dangerButtonClasses =
  "rounded-full border border-red-300 px-5 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40";

export default function ContactManager({
  initialEntries,
}: {
  initialEntries: ContactEntry[];
}) {
  const [entries, setEntries] = useState<ContactEntry[]>(initialEntries);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<ContactEntry | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) {
        throw new Error("Request failed");
      }
      setEntries((await res.json()) as ContactEntry[]);
    } catch {
      setErrors(["Could not load contact messages."]);
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

  function startEdit(entry: ContactEntry) {
    setEditing(entry);
    setEditName(entry.name);
    setEditEmail(entry.email);
    setEditMessage(entry.message);
    setErrors([]);
    setNotice("");
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) {
      return;
    }
    const ok = await callApi("PUT", `/api/contact/${editing.id}`, {
      name: editName,
      email: editEmail,
      message: editMessage,
    });
    if (ok) {
      setNotice("Contact message updated.");
      setEditing(null);
      await reload();
    }
  }

  async function deleteEntry(entry: ContactEntry) {
    const ok = await callApi("DELETE", `/api/contact/${entry.id}`);
    if (ok) {
      setNotice("Contact message deleted.");
      if (editing?.id === entry.id) {
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

      {editing && (
        <form
          onSubmit={saveEdit}
          className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
        >
          <h2 className="text-lg font-semibold">Edit message</h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-contact-name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="edit-contact-name"
              type="text"
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-contact-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="edit-contact-email"
              type="text"
              value={editEmail}
              onChange={(event) => setEditEmail(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-contact-message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="edit-contact-message"
              rows={4}
              value={editMessage}
              onChange={(event) => setEditMessage(event.target.value)}
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
        <h2 className="text-lg font-semibold">All contact messages</h2>
        {entries.length === 0 ? (
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            No contact messages yet.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold">{entry.name}</span>
                  <time className="text-xs text-zinc-500 dark:text-zinc-500">
                    {new Date(entry.submittedAt).toLocaleString("en-US")}
                  </time>
                </div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {entry.email}
                </p>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {entry.message}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => startEdit(entry)}
                    className={secondaryButtonClasses}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEntry(entry)}
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
