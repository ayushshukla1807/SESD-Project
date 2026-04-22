'use client';

import { useState, useEffect } from 'react';
import AnalyticsView from './components/AnalyticsView';
import ActivityFeed from './components/ActivityFeed';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type ViewType = 'board' | 'analytics';

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
  const [analytics, setAnalytics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>('board');
  
  const [currentUser, setCurrentUser] = useState({ id: 'admin1', name: 'Super Admin', role: 'Admin' });
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', projectId: '', developerId: 'dev1' });

  const fetchData = async () => {
    try {
      const [taskRes, projectRes, analyticsRes, auditRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/projects'),
        fetch('/api/analytics'),
        fetch('/api/audit')
      ]);
      const [taskData, projectData, analyticsData, auditData] = await Promise.all([
        taskRes.json(),
        projectRes.json(),
        analyticsRes.json(),
        auditRes.json()
      ]);
      setTasks(taskData);
      setProjects(projectData);
      setAnalytics(analyticsData);
      setAuditLogs(auditData);
      
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
    const interval = setInterval(fetchData, 10000); // Polling for "live" feel
    return () => clearInterval(interval);
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: currentUser.id, ...newTask })
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
      alert('Simulation: Only Developers can modify task states in this release.');
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
      setCurrentUser({ id: 'dev1', name: 'Alice (Senior Dev)', role: 'Developer' });
    } else {
      setCurrentUser({ id: 'admin1', name: 'Super Admin', role: 'Admin' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Syncing Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 sm:px-6 lg:px-8">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-800/50">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tight text-white">
              Synapse <span className="text-violet-500 text-lg align-top font-mono">v4.1.2</span>
            </h1>
            <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-violet-500/20">
              Enterprise
            </span>
          </div>
          <p className="text-slate-500 text-sm max-w-lg">
            Production-grade engineering management. Logged in as <span className="text-slate-300 font-bold underline decoration-violet-500/50 cursor-pointer" onClick={toggleUser}>@{currentUser.name}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex">
            <button 
              onClick={() => setActiveView('board')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeView === 'board' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Board
            </button>
            <button 
              onClick={() => setActiveView('analytics')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeView === 'analytics' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Analytics
            </button>
          </div>
          
          <div className="h-8 w-[1px] bg-slate-800 mx-2 hidden md:block" />

          {currentUser.role === 'Admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xl shadow-violet-600/20 active:scale-95 flex items-center gap-2"
            >
              <span className="text-lg">+</span> Create Task
            </button>
          )}
        </div>
      </div>

      {activeView === 'board' ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Columns */}
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((col) => {
              const colTasks = tasks.filter(t => t.status === col);
              return (
                <div key={col} className="space-y-5">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">{col.replace('_', ' ')}</h3>
                    <span className="bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded text-[10px] font-mono">{colTasks.length}</span>
                  </div>
                  <div className="bg-slate-900/30 border border-slate-800/40 rounded-3xl p-3 min-h-[600px] space-y-4">
                    {colTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => updateStatus(task.id, task.status)}
                        className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-blue-500/40 transition-all cursor-pointer group"
                      >
                        <p className="text-sm font-semibold text-slate-200 mb-4 group-hover:text-white">{task.title}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                          <span className="text-[10px] font-bold text-violet-500 uppercase tracking-tighter">
                            {projects.find(p => p.id === task.projectId)?.title || 'Core'}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-400">
                              {task.developerId?.charAt(0).toUpperCase() || '?'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity Sidebar */}
          <div className="space-y-6">
             <ActivityFeed logs={auditLogs} />
          </div>
        </div>
      ) : (
        <AnalyticsView stats={analytics?.stats} weeklyActivity={analytics?.weeklyActivity} />
      )}

      {/* Modal - Kept minimal for code brevity */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-bold text-white mb-8">Initialize Technical Ticket</h2>
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
                <input 
                  autoFocus required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scope</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white outline-none"
                    value={newTask.projectId}
                    onChange={(e) => setNewTask(prev => ({ ...prev, projectId: e.target.value }))}
                  >
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lead</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white outline-none">
                    <option value="dev1">Alice (dev1)</option>
                    <option value="dev2">Bob (dev2)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-bold text-sm">Dismiss</button>
                <button type="submit" className="flex-1 bg-white text-black py-4 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Finalize Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
