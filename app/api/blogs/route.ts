import type { NextRequest } from "next/server";
import { loggedJson } from "../../lib/request-log";
import {
  normalizeText,
  readBlogs,
  uniqueSlug,
  writeBlogs,
} from "../../lib/entities";
import type { BlogPost } from "../../lib/types";

export async function GET(request: NextRequest) {
  const posts = await readBlogs();
  const sorted = [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return loggedJson(request, sorted, 200);
}

export async function POST(request: NextRequest) {
  let payload: { title?: unknown; content?: unknown };
  try {
    payload = await request.json();
  } catch {
    return loggedJson(request, { errors: ["Invalid request body."] }, 400);
  }

  const title = normalizeText(payload.title);
  const content = normalizeText(payload.content);

  const errors: string[] = [];
  if (title.length === 0) {
    errors.push("Title cannot be blank.");
  }
  if (content.length === 0) {
    errors.push("Content cannot be blank.");
  }

  if (errors.length > 0) {
    return loggedJson(request, { errors }, 400);
  }

  const posts = await readBlogs();
  const post: BlogPost = {
    slug: uniqueSlug(title, posts),
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  posts.push(post);
  await writeBlogs(posts);

  return loggedJson(request, { slug: post.slug, title: post.title }, 201);
}
