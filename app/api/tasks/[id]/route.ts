import { NextRequest, NextResponse } from 'next/server';
import { TaskService } from '../../../../core/services/TaskService';
import { TaskStatus } from '../../../../core/models/Task';

const taskService = new TaskService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { developerId, status } = body;
    const { id: taskId } = await params;
    
    const updatedTask = taskService.updateTaskStatus(developerId, taskId, status as TaskStatus);
    
    return NextResponse.json(updatedTask);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
