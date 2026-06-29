import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  createProject,
  validateProjectInput,
} from "@/lib/projects/admin-service";
import type { Project } from "@/types";

export async function POST(request: Request) {
  try {
    await requireAdminUser();

    const body = (await request.json()) as Partial<Project>;
    const project = validateProjectInput(body);
    await createProject(project);

    return NextResponse.json({ message: "Project published.", project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to publish.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
