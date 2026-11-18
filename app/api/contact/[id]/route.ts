import type { NextRequest } from "next/server";
import { loggedJson } from "../../../lib/request-log";
import {
  isValidEmail,
  normalizeText,
  ensureContactIds,
  writeContacts,
} from "../../../lib/entities";

type Params = { params: Promise<{ id: string }> };

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const { id } = await params;
  const messages = await ensureContactIds();
  const entry = messages.find((item) => item.id === id);
  if (!entry) {
    return loggedJson(request, { errors: ["Contact message not found."] }, 404);
  }
  return loggedJson(request, entry, 200);
}

export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  const { id } = await params;

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
  const index = messages.findIndex((item) => item.id === id);
  if (index === -1) {
    return loggedJson(request, { errors: ["Contact message not found."] }, 404);
  }

  const updated = { ...messages[index], name, email, message };
  messages[index] = updated;
  await writeContacts(messages);

  return loggedJson(request, updated, 200);
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  const { id } = await params;
  const messages = await ensureContactIds();
  const remaining = messages.filter((item) => item.id !== id);
  if (remaining.length === messages.length) {
    return loggedJson(request, { errors: ["Contact message not found."] }, 404);
  }
  await writeContacts(remaining);
  return loggedJson(request, { status: "deleted" }, 200);
}
