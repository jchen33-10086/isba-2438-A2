import type { NextRequest } from "next/server";
import { loggedJson } from "../../../lib/request-log";
import { normalizeText, readBlogs, writeBlogs } from "../../../lib/entities";

type Params = { params: Promise<{ slug: string }> };

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const { slug } = await params;
  const posts = await readBlogs();
  const post = posts.find((item) => item.slug === slug);
  if (!post) {
    return loggedJson(request, { errors: ["Blog post not found."] }, 404);
  }
  return loggedJson(request, post, 200);
}

export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  const { slug } = await params;

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
  const index = posts.findIndex((item) => item.slug === slug);
  if (index === -1) {
    return loggedJson(request, { errors: ["Blog post not found."] }, 404);
  }

  const updated = { ...posts[index], title, content };
  posts[index] = updated;
  await writeBlogs(posts);

  return loggedJson(request, updated, 200);
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  const { slug } = await params;
  const posts = await readBlogs();
  const remaining = posts.filter((item) => item.slug !== slug);
  if (remaining.length === posts.length) {
    return loggedJson(request, { errors: ["Blog post not found."] }, 404);
  }
  await writeBlogs(remaining);
  return loggedJson(request, { status: "deleted" }, 200);
}
