import type { NextRequest } from "next/server";
import { loggedJson } from "../../../lib/request-log";
import {
  normalizeText,
  isValidHttpUrl,
  readResources,
  writeResources,
} from "../../../lib/entities";
import type { Resource } from "../../../lib/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const { id } = await params;
  const resources = await readResources();
  const resource = resources.find((item) => item.id === id);
  if (!resource) {
    return loggedJson(request, { errors: ["Resource not found."] }, 404);
  }
  return loggedJson(request, resource, 200);
}

export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  const { id } = await params;

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
  const index = resources.findIndex((item) => item.id === id);
  if (index === -1) {
    return loggedJson(request, { errors: ["Resource not found."] }, 404);
  }

  const updated: Resource = { ...resources[index], title, url, topic, notes };
  resources[index] = updated;
  await writeResources(resources);

  return loggedJson(request, updated, 200);
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  const { id } = await params;
  const resources = await readResources();
  const remaining = resources.filter((item) => item.id !== id);
  if (remaining.length === resources.length) {
    return loggedJson(request, { errors: ["Resource not found."] }, 404);
  }
  await writeResources(remaining);
  return loggedJson(request, { status: "deleted" }, 200);
}
