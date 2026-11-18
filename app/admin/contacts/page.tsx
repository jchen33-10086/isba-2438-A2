import type { Metadata } from "next";
import { connection } from "next/server";
import { readContacts } from "../../lib/entities";
import ContactManager from "./contact-manager";

export const instant = false;

export const metadata: Metadata = {
  title: "Manage Contact Messages",
};

export default async function AdminContacts() {
  await connection();
  const entries = await readContacts();

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Manage Contact Messages
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Review, edit, and delete contact form submissions. Data comes from
        /api/contact and is stored in a server JSON file.
      </p>
      <div className="mt-10 max-w-2xl">
        <ContactManager initialEntries={entries} />
      </div>
    </section>
  );
}
