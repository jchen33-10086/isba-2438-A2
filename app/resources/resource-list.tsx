"use client";

import { useEffect, useState } from "react";
import ResourceCard from "./resource-card";
import type { Resource } from "../lib/types";

export default function ResourceList() {
  const [resources, setResources] = useState<Resource[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/resources");
        if (!res.ok) {
          throw new Error("Request failed");
        }
        setResources((await res.json()) as Resource[]);
      } catch {
        setError("Could not load resources. Please try again later.");
      }
    }
    load();
  }, []);

  if (error) {
    return (
      <p
        role="alert"
        className="mt-10 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
      >
        {error}
      </p>
    );
  }

  if (resources === null) {
    return <p className="mt-10 text-zinc-600 dark:text-zinc-400">Loading resources...</p>;
  }

  if (resources.length === 0) {
    return (
      <p className="mt-10 text-zinc-600 dark:text-zinc-400">
        No resources yet. Check back soon!
      </p>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
