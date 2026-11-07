import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6 px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        Welcome to my portfolio
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Hi, I&apos;m Jiaxing Chen.
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        I&apos;m a Master of Science in Business Analytics (MSBA) student at
        Santa Clara University with a passion for turning data into insights.
        Explore my projects and get in touch.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/projects"
          className="flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          View My Projects
        </Link>
        <Link
          href="/contact-me-server-form"
          className="flex h-11 items-center rounded-full border border-zinc-300 px-6 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Contact Me
        </Link>
      </div>
    </section>
  );
}
