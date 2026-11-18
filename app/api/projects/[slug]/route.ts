import type { NextRequest } from "next/server";
import { loggedJson } from "../../../lib/request-log";
import {
  normalizeTech,
  normalizeText,
  normalizeStringArray,
  readProjects,
  writeProjects,
} from "../../../lib/entities";
import type { Project } from "../../../lib/types";

type Params = { params: Promise<{ slug: string }> };

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const { slug } = await params;
  const projects = await readProjects();
  const project = projects.find((item) => item.slug === slug);
  if (!project) {
    return loggedJson(request, { errors: ["Project not found."] }, 404);
  }
  return loggedJson(request, project, 200);
}

export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  const { slug } = await params;

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
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) {
    return loggedJson(request, { errors: ["Project not found."] }, 404);
  }

  const updated: Project = { ...projects[index], title, description, tech, overview, features };
  projects[index] = updated;
  await writeProjects(projects);

  return loggedJson(request, updated, 200);
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  const { slug } = await params;
  const projects = await readProjects();
  const remaining = projects.filter((item) => item.slug !== slug);
  if (remaining.length === projects.length) {
    return loggedJson(request, { errors: ["Project not found."] }, 404);
  }
  await writeProjects(remaining);
  return loggedJson(request, { status: "deleted" }, 200);
}
