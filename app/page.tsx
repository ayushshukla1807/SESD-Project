'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../core/models/Task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (id: string, currentStatus: TaskStatus) => {
    const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ developerId: 'dev1', status: statuses[nextIdx] }) // Mock dev auth
      });
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-center mt-20 animate-pulse">Loading Workspace...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Active Sprint Board</h2>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-colors">
          + New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['TODO', 'IN_PROGRESS', 'DONE'].map((statusColumn) => (
          <div key={statusColumn} className="bg-white/5 border border-white/10 rounded-xl p-4 min-h-[400px]">
            <h3 className="text-sm font-medium text-slate-400 mb-4 tracking-wider flex items-center justify-between">
              {statusColumn.replace('_', ' ')}
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">
                {tasks.filter(t => t.status === statusColumn).length}
              </span>
            </h3>
            
            <div className="space-y-3">
              {tasks.filter(t => t.status === statusColumn).map(task => (
                <div 
                  key={task.id} 
                  className="bg-slate-900 border border-slate-700/50 p-4 rounded-lg shadow-lg hover:border-slate-500 transition-colors group cursor-pointer"
                  onClick={() => updateStatus(task.id, task.status)}
                >
                  <p className="font-medium mb-2">{task.title}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{task.id}</span>
                    <span className="bg-slate-800 px-2 py-1 rounded">Dev: {task.developerId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
