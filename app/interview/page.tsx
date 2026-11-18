import type { Metadata } from "next";
import QuestionList from "./question-list";

export const metadata: Metadata = {
  title: "Interview Questions",
};

export default function Interview() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Interview Question Shortlist
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Build a personal shortlist of interview questions. Questions are saved
        in your browser only (localStorage) — nothing is sent to a server.
      </p>
      <div className="mt-10 max-w-xl">
        <QuestionList />
      </div>
    </section>
  );
}
