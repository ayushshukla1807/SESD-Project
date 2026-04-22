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

interface ProjectData {
  id: string;
  title: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Simulated User Session
  const [currentUser, setCurrentUser] = useState({ id: 'admin1', name: 'Super Admin', role: 'Admin' });
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', projectId: '', developerId: 'dev1' });

  const fetchData = async () => {
    try {
      const [taskRes, projectRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/projects')
      ]);
      const [taskData, projectData] = await Promise.all([
        taskRes.json(),
        projectRes.json()
      ]);
      setTasks(taskData);
      setProjects(projectData);
      if (projectData.length > 0 && !newTask.projectId) {
        setNewTask(prev => ({ ...prev, projectId: projectData[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: currentUser.id,
          ...newTask
        })
      });
      setShowModal(false);
      setNewTask(prev => ({ ...prev, title: '' }));
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatus = async (id: string, currentStatus: TaskStatus) => {
    if (currentUser.role !== 'Developer') {
      alert('Only Developers can move tasks on the board for this demo.');
      return;
    }

    const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ developerId: currentUser.id, status: statuses[nextIdx] })
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleUser = () => {
    if (currentUser.role === 'Admin') {
      setCurrentUser({ id: 'dev1', name: 'Alice (Dev)', role: 'Developer' });
    } else {
      setCurrentUser({ id: 'admin1', name: 'Super Admin', role: 'Admin' });
    }
  };

  const statusColors: Record<TaskStatus, string> = {
    'TODO': 'from-amber-500/10 to-amber-600/5 border-amber-500/20',
    'IN_PROGRESS': 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
    'DONE': 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20',
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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            TaskFlow Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Logged in as <span className="text-blue-400 font-medium">@{currentUser.name}</span> ({currentUser.role})
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleUser}
            className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            Switch to {currentUser.role === 'Admin' ? 'Developer' : 'Admin'}
          </button>
          
          {currentUser.role === 'Admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
            >
              <span className="text-xl leading-none">+</span> New Task
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((statusColumn) => {
          const columnTasks = tasks.filter(t => t.status === statusColumn);
          return (
            <div key={statusColumn} className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center gap-3 px-1">
                <span className={`w-2.5 h-2.5 rounded-full ${statusDots[statusColumn]}`} />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                  {statusColumn.replace('_', ' ')}
                </h3>
                <span className="ml-auto bg-slate-800 text-slate-500 px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-slate-700">
                  {columnTasks.length}
                </span>
              </div>

              {/* Column Body */}
              <div className={`bg-gradient-to-b ${statusColors[statusColumn]} border border-slate-800/40 rounded-2xl p-4 min-h-[450px] space-y-4 backdrop-blur-sm`}>
                {columnTasks.map(task => (
                  <div
                    key={task.id}
                    className="bg-slate-900/60 border border-slate-700/50 p-4 rounded-xl shadow-sm hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                    onClick={() => updateStatus(task.id, task.status)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <p className="font-medium text-slate-200 leading-snug group-hover:text-white transition-colors">{task.title}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">Project</span>
                        <span className="text-[11px] text-blue-400 font-medium">
                          {projects.find(p => p.id === task.projectId)?.title || 'TaskFlow Core'}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">Assignee</span>
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-700">
                          {task.developerId || 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-48 text-[11px] text-slate-600 uppercase tracking-widest italic opacity-50">
                    Empty Queue
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-6 text-white">Initialize Technical Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Task Title</label>
                <input 
                  autoFocus
                  required
                  placeholder="e.g. Implement Repository Pattern"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Scope</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={newTask.projectId}
                    onChange={(e) => setNewTask(prev => ({ ...prev, projectId: e.target.value }))}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assignee</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={newTask.developerId}
                    onChange={(e) => setNewTask(prev => ({ ...prev, developerId: e.target.value }))}
                  >
                    <option value="dev1">Alice (dev1)</option>
                    <option value="dev2">Bob (dev2)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg text-slate-400 font-medium hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
