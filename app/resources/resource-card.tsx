"use client";

import type { Resource } from "../lib/types";

const secondaryButtonClasses =
  "rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900";

const dangerButtonClasses =
  "rounded-full border border-red-300 px-4 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40";

type Props = {
  resource: Resource;
  onEdit?: (resource: Resource) => void;
  onDelete?: (resource: Resource) => void;
};

export default function ResourceCard({ resource, onEdit, onDelete }: Props) {
  return (
    <article className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">{resource.title}</h2>
        <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium dark:bg-zinc-900">
          {resource.topic}
        </span>
      </div>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-sm font-medium text-blue-600 underline underline-offset-2 dark:text-blue-400"
      >
        {resource.url}
      </a>
      {resource.notes.length > 0 && (
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {resource.notes}
        </p>
      )}
      {(onEdit || onDelete) && (
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(resource)}
              className={secondaryButtonClasses}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(resource)}
              className={dangerButtonClasses}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}
