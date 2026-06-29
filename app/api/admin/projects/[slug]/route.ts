import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  removeProject,
  updateProject,
  validateProjectInput,
} from "@/lib/projects/admin-service";
import { getProjectBySlug } from "@/lib/projects/repository";
import type { Project } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdminUser();
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load project.";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdminUser();
    const { slug: previousSlug } = await params;
    const body = (await request.json()) as Partial<Project>;
    const project = validateProjectInput(body);
    await updateProject(previousSlug, project);

    return NextResponse.json({ message: "Project updated.", project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update project.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdminUser();
    const { slug } = await params;
    await removeProject(slug);

    return NextResponse.json({ message: "Project deleted." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete project.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
