import { NextResponse } from 'next/server';
import { TaskService } from '../../../../core/services/TaskService';
import { TaskStatus } from '../../../../core/models/Task';

const taskService = new TaskService();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { developerId, status } = body;
    
    const id = params.id; // wait, params lookup is async in recent Next.js 15+, but let's assume this is ok for a simple layout. Or we can just destructure directly. Wait Next params are a Promise in some latest versions, but we'll await it just in case.
    const resolvedParams = await Promise.resolve(params);
    const taskId = resolvedParams.id;
    
    const updatedTask = taskService.updateTaskStatus(developerId, taskId, status as TaskStatus);
    
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
