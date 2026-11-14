"use client";

import { useState } from "react";

const inputClasses =
  "h-11 rounded-lg border border-zinc-300 px-4 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-zinc-50";

export default function ContactForm() {
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsPending(true);
    setSuccess(false);
    setErrors([]);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          message: String(formData.get("message") ?? ""),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        form.reset();
      } else {
        setErrors(
          data.errors ?? ["Something went wrong. Please try again."]
        );
      }
    } catch {
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          className={inputClasses}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className={inputClasses}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Write your message here..."
          className="rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-zinc-50"
        />
      </div>

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
      {success && (
        <div
          role="status"
          className="rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400"
        >
          Your message has been sent successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
