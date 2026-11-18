import type { Metadata } from "next";
import { connection } from "next/server";
import { readResources } from "../../lib/entities";
import ResourceManager from "./resource-manager";

export const instant = false;

export const metadata: Metadata = {
  title: "Manage Resources",
};

export default async function AdminResources() {
  await connection();
  const resources = await readResources();

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Manage Learning Resources
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Create, update, and delete learning resources. Changes are saved to a
        server JSON file via /api/resources.
      </p>
      <div className="mt-10 max-w-xl">
        <ResourceManager initialResources={resources} />
      </div>
    </section>
  );
}
