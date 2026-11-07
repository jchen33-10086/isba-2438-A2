"use server";

import { promises as fs } from "fs";
import path from "path";
import type { ContactFormState } from "./form-state";

function isValidEmail(email: string): boolean {
  if (email.includes(" ")) {
    return false;
  }
  const parts = email.split("@");
  if (parts.length !== 2) {
    return false;
  }
  const [local, domain] = parts;
  if (local.length === 0) {
    return false;
  }
  const domainParts = domain.split(".");
  if (domainParts.length < 2) {
    return false;
  }
  return domainParts.every((part) => part.length > 0);
}

type StoredMessage = {
  name: string;
  email: string;
  message: string;
  submittedAt: string;
};

export async function sendMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const message = String(formData.get("message") ?? "");

  const errors: string[] = [];
  if (name.trim().length === 0) {
    errors.push("Name cannot be blank.");
  }
  if (!isValidEmail(email)) {
    errors.push(
      "Email must contain one @, text before it, a domain with a dot, and no spaces."
    );
  }
  if (message.trim().length === 0) {
    errors.push("Message cannot be blank.");
  }

  if (errors.length > 0) {
    return { status: "error", errors };
  }

  const dataDir = path.join(process.cwd(), "data");
  const dataFile = path.join(dataDir, "messages.json");
  await fs.mkdir(dataDir, { recursive: true });

  let messages: StoredMessage[] = [];
  try {
    messages = JSON.parse(
      await fs.readFile(dataFile, "utf8")
    ) as StoredMessage[];
  } catch {
    messages = [];
  }

  messages.push({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    submittedAt: new Date().toISOString(),
  });

  await fs.writeFile(dataFile, JSON.stringify(messages, null, 2), "utf8");

  return { status: "success", errors: [] };
}
