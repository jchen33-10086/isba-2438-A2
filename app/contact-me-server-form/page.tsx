import type { Metadata } from "next";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Me",
};

export default function Contact() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Contact Me
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Fill out the form below. Your message is validated and saved to a JSON
        file by a server action.
      </p>
      <div className="mt-10 max-w-xl">
        <ContactForm />
      </div>
    </section>
  );
}
