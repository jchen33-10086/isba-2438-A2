import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
};

const skills = ["SQL", "Python", "Data Analysis"];

export default function About() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        About Me
      </h1>
      <div className="mt-6 flex flex-col gap-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        <p>
          I&apos;m Jiaxing Chen, a Master of Science in Business Analytics
          (MSBA) student at Santa Clara University. I enjoy working with data
          to uncover insights and solve real-world business problems.
        </p>
        <p>
          Feel free to check out my projects below or reach out through the
          contact page.
        </p>
      </div>
      <h2 className="mt-12 text-xl font-semibold">Skills</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium dark:border-zinc-700"
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}

