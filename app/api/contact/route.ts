import type { NextRequest } from "next/server";
import { loggedJson } from "../../lib/request-log";
import {
  createId,
  isValidEmail,
  normalizeText,
  ensureContactIds,
  writeContacts,
} from "../../lib/entities";

export async function GET(request: NextRequest) {
  const messages = await ensureContactIds();
  return loggedJson(request, messages, 200);
}

export async function POST(request: NextRequest) {
  let payload: { name?: unknown; email?: unknown; message?: unknown };
  try {
    payload = await request.json();
  } catch {
    return loggedJson(request, { errors: ["Invalid request body."] }, 400);
  }

  const name = normalizeText(payload.name);
  const email = normalizeText(payload.email);
  const message = normalizeText(payload.message);

  const errors: string[] = [];
  if (name.length === 0) {
    errors.push("Name cannot be blank.");
  }
  if (!isValidEmail(email)) {
    errors.push(
      "Email must contain one @, text before it, a domain with a dot, and no spaces."
    );
  }
  if (message.length === 0) {
    errors.push("Message cannot be blank.");
  }

  if (errors.length > 0) {
    return loggedJson(request, { errors }, 400);
  }

  const messages = await ensureContactIds();
  const entry = {
    id: createId(),
    name,
    email,
    message,
    submittedAt: new Date().toISOString(),
  };

  messages.push(entry);
  await writeContacts(messages);

  return loggedJson(request, { status: "success", id: entry.id }, 201);
}
