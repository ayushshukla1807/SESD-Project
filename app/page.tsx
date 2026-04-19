'use client';

import { useState, useEffect } from 'react';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

interface TaskData {
  id: string;
  title: string;
  status: TaskStatus;
  projectId: string;
  developerId: string | null;
}

export default function Home() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
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
        body: JSON.stringify({ developerId: 'dev1', status: statuses[nextIdx] })
      });
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const statusColors: Record<TaskStatus, string> = {
    'TODO': 'from-amber-500/20 to-amber-600/5 border-amber-500/30',
    'IN_PROGRESS': 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
    'DONE': 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
  };

  const statusDots: Record<TaskStatus, string> = {
    'TODO': 'bg-amber-400',
    'IN_PROGRESS': 'bg-blue-400 animate-pulse',
    'DONE': 'bg-emerald-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm tracking-wider">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Active Sprint Board</h2>
          <p className="text-slate-500 text-sm mt-1">{tasks.length} tasks across all stages</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95">
          + New Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((statusColumn) => {
          const columnTasks = tasks.filter(t => t.status === statusColumn);
          return (
            <div key={statusColumn} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center gap-3 px-1">
                <span className={`w-2.5 h-2.5 rounded-full ${statusDots[statusColumn]}`} />
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider">
                  {statusColumn.replace('_', ' ')}
                </h3>
                <span className="bg-white/10 text-slate-400 px-2 py-0.5 rounded-full text-xs font-mono">
                  {columnTasks.length}
                </span>
              </div>

              {/* Column Body */}
              <div className={`bg-gradient-to-b ${statusColors[statusColumn]} border rounded-xl p-3 min-h-[350px] space-y-3`}>
                {columnTasks.map(task => (
                  <div
                    key={task.id}
                    className="bg-slate-900/80 backdrop-blur border border-slate-700/50 p-4 rounded-lg shadow-lg hover:border-slate-500 hover:shadow-xl transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
                    onClick={() => updateStatus(task.id, task.status)}
                  >
                    <p className="font-medium mb-3 group-hover:text-white transition-colors">{task.title}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-mono">{task.id.slice(0, 8)}</span>
                      <span className="bg-slate-800 px-2 py-1 rounded-md">
                        {task.developerId || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                ))}
                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-xs text-slate-600 italic">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
