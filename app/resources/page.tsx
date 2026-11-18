import type { Metadata } from "next";
import ResourceList from "./resource-list";

export const metadata: Metadata = {
  title: "Learning Resources",
};

export default function Resources() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Learning Resources
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        A library of learning resources, fetched from /api/resources. Each
        entry links to the original source.
      </p>
      <ResourceList />
    </section>
  );
}
