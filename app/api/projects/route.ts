import { NextResponse } from 'next/server';
import { ProjectService } from '../../../core/services/ProjectService';

const projectService = new ProjectService();

export async function GET() {
  try {
    const projects = projectService.getAllProjects();
    return NextResponse.json(projects);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminId, title } = body;
    
    if (!adminId || !title) {
      return NextResponse.json({ error: 'adminId and title are required' }, { status: 400 });
    }

    const newProject = projectService.createProject(adminId, title);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
