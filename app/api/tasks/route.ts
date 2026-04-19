import { NextResponse } from 'next/server';
import { TaskService } from '../../../core/services/TaskService';

const taskService = new TaskService();

export async function GET() {
  try {
    const tasks = taskService.getAllTasks();
    return NextResponse.json(tasks);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminId, title, projectId, developerId } = body;
    
    // In a real app auth tokens provide adminId
    const newTask = taskService.assignTask(adminId, title, projectId, developerId);
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
