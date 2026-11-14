import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

type BlogPost = {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
};

const dataFile = path.join(process.cwd(), "data", "blogs.json");

async function readPosts(): Promise<BlogPost[]> {
  try {
    return JSON.parse(await fs.readFile(dataFile, "utf8")) as BlogPost[];
  } catch {
    return [];
  }
}

async function writePosts(posts: BlogPost[]): Promise<void> {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(posts, null, 2), "utf8");
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(title: string, posts: BlogPost[]): string {
  const taken = new Set(posts.map((post) => post.slug));
  const base = slugify(title);
  let candidate = base.length > 0 ? base : "post";
  let counter = 2;
  while (taken.has(candidate)) {
    candidate = `${base.length > 0 ? base : "post"}-${counter}`;
    counter += 1;
  }
  return candidate;
}

export async function GET() {
  const posts = await readPosts();
  const sorted = [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(sorted);
}

export async function POST(request: Request) {
  let payload: { title?: unknown; content?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { errors: ["Invalid request body."] },
      { status: 400 }
    );
  }

  const title = String(payload.title ?? "");
  const content = String(payload.content ?? "");

  const errors: string[] = [];
  if (title.trim().length === 0) {
    errors.push("Title cannot be blank.");
  }
  if (content.trim().length === 0) {
    errors.push("Content cannot be blank.");
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const posts = await readPosts();
  const post: BlogPost = {
    slug: uniqueSlug(title.trim(), posts),
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  posts.push(post);
  await writePosts(posts);

  return NextResponse.json({ slug: post.slug, title: post.title }, { status: 201 });
}
