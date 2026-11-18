import type { NextRequest } from "next/server";
import { loggedJson } from "../../lib/request-log";
import {
  createId,
  normalizeText,
  isValidHttpUrl,
  readResources,
  writeResources,
} from "../../lib/entities";
import type { Resource } from "../../lib/types";

export async function GET(request: NextRequest) {
  const resources = await readResources();
  const sorted = [...resources].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return loggedJson(request, sorted, 200);
}

export async function POST(request: NextRequest) {
  let payload: { title?: unknown; url?: unknown; topic?: unknown; notes?: unknown };
  try {
    payload = await request.json();
  } catch {
    return loggedJson(request, { errors: ["Invalid request body."] }, 400);
  }

  const title = normalizeText(payload.title);
  const url = normalizeText(payload.url);
  const topic = normalizeText(payload.topic);
  const notes = normalizeText(payload.notes);

  const errors: string[] = [];
  if (title.length === 0) {
    errors.push("Title cannot be blank.");
  }
  if (!isValidHttpUrl(url)) {
    errors.push("URL must be a valid http(s) link.");
  }
  if (topic.length === 0) {
    errors.push("Topic cannot be blank.");
  }

  if (errors.length > 0) {
    return loggedJson(request, { errors }, 400);
  }

  const resources = await readResources();
  const resource: Resource = {
    id: createId(),
    title,
    url,
    topic,
    notes,
    createdAt: new Date().toISOString(),
  };

  resources.push(resource);
  await writeResources(resources);

  return loggedJson(request, { id: resource.id, title: resource.title }, 201);
}
