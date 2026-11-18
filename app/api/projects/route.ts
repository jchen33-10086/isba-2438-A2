import type { NextRequest } from "next/server";
import { loggedJson } from "../../lib/request-log";
import {
  normalizeTech,
  normalizeText,
  normalizeStringArray,
  readProjects,
  uniqueSlug,
  writeProjects,
} from "../../lib/entities";
import type { Project } from "../../lib/types";

export async function GET(request: NextRequest) {
  const projects = await readProjects();
  return loggedJson(request, projects, 200);
}

export async function POST(request: NextRequest) {
  let payload: {
    title?: unknown;
    description?: unknown;
    tech?: unknown;
    overview?: unknown;
    features?: unknown;
  };
  try {
    payload = await request.json();
  } catch {
    return loggedJson(request, { errors: ["Invalid request body."] }, 400);
  }

  const title = normalizeText(payload.title);
  const description = normalizeText(payload.description);
  const tech = normalizeTech(payload.tech);
  const overview = normalizeText(payload.overview);
  const features = normalizeStringArray(payload.features);

  const errors: string[] = [];
  if (title.length === 0) {
    errors.push("Title cannot be blank.");
  }
  if (description.length === 0) {
    errors.push("Description cannot be blank.");
  }

  if (errors.length > 0) {
    return loggedJson(request, { errors }, 400);
  }

  const projects = await readProjects();
  const project: Project = {
    slug: uniqueSlug(title, projects),
    title,
    description,
    tech,
    overview,
    features,
  };

  projects.push(project);
  await writeProjects(projects);

  return loggedJson(request, { slug: project.slug, title: project.title }, 201);
}
