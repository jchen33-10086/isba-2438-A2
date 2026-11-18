import { randomUUID } from "crypto";
import { readJson, writeJson } from "./json-store";
import type { BlogPost, ContactEntry, Project, Resource } from "./types";

export function createId(): string {
  return randomUUID();
}

export function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isValidEmail(email: string): boolean {
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

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(title: string, existing: { slug: string }[]): string {
  const taken = new Set(existing.map((item) => item.slug));
  const base = slugify(title);
  let candidate = base.length > 0 ? base : "item";
  let counter = 2;
  while (taken.has(candidate)) {
    candidate = `${base.length > 0 ? base : "item"}-${counter}`;
    counter += 1;
  }
  return candidate;
}

export function normalizeTech(value: unknown): string[] {
  const parts = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  return parts
    .map((part) => String(part).trim())
    .filter((part) => part.length > 0);
}

export function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((part) => String(part).trim())
    .filter((part) => part.length > 0);
}

export async function readContacts(): Promise<ContactEntry[]> {
  return readJson<ContactEntry[]>("messages.json", []);
}

export async function writeContacts(messages: ContactEntry[]): Promise<void> {
  await writeJson("messages.json", messages);
}

export async function ensureContactIds(): Promise<ContactEntry[]> {
  const messages = await readContacts();
  let changed = false;
  const normalized = messages.map((entry) => {
    const record = entry as { id?: unknown };
    if (typeof record.id === "string" && record.id.length > 0) {
      return entry;
    }
    changed = true;
    return { ...entry, id: createId() };
  });
  if (changed) {
    await writeContacts(normalized);
  }
  return normalized;
}

export async function readBlogs(): Promise<BlogPost[]> {
  return readJson<BlogPost[]>("blogs.json", []);
}

export async function writeBlogs(posts: BlogPost[]): Promise<void> {
  await writeJson("blogs.json", posts);
}

export async function readProjects(): Promise<Project[]> {
  return readJson<Project[]>("projects.json", []);
}

export async function writeProjects(projects: Project[]): Promise<void> {
  await writeJson("projects.json", projects);
}

export async function readResources(): Promise<Resource[]> {
  return readJson<Resource[]>("resources.json", []);
}

export async function writeResources(resources: Resource[]): Promise<void> {
  await writeJson("resources.json", resources);
}
