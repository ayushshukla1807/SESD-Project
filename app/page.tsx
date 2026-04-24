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
    const interval = setInterval(fetchData, 10000);
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
      alert('Access Denied: Switch to Developer identity to move tasks.');
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
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-violet-500/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-violet-600 rounded-full animate-spin" />
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Initializing Interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-4 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-violet-600/10 text-violet-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-violet-500/20">
              v4.1.2 Enterprise
            </span>
            <div className="h-4 w-[1px] bg-slate-800" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Engine Stable
            </span>
          </div>
          <div>
            <h2 className="text-5xl font-black tracking-tighter text-white lg:text-6xl">
              Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-fuchsia-400">Synchrony.</span>
            </h2>
            <p className="text-slate-500 text-lg mt-3 max-w-xl leading-relaxed">
              Managing infrastructure, roadmaps, and execution for high-performance technical teams.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] rounded-2xl border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setActiveView('board')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeView === 'board' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Board
          </button>
          <button 
            onClick={() => setActiveView('analytics')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeView === 'analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Analytics
          </button>
        </div>
      </div>

      {activeView === 'board' ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 items-start">
          {/* Main Board */}
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((col) => {
              const colTasks = tasks.filter(t => t.status === col);
              return (
                <div key={col} className="space-y-6 bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden group/col">
                  {/* Subtle Top Glow */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50 ${col === 'DONE' ? 'from-emerald-500/0 via-emerald-500 to-emerald-500/0' : col === 'IN_PROGRESS' ? 'from-indigo-500/0 via-indigo-500 to-indigo-500/0' : 'from-slate-500/0 via-slate-500 to-slate-500/0'}`} />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${col === 'DONE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : col === 'IN_PROGRESS' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.8)]'}`} />
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.15em]">{col.replace('_', ' ')}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">{colTasks.length}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {colTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => updateStatus(task.id, task.status)}
                        className="glass-card p-5 rounded-2xl group cursor-pointer border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300"
                      >
                        <p className="text-sm font-semibold text-slate-100 mb-5 group-hover:text-indigo-300 transition-colors leading-relaxed">{task.title}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Scope</span>
                            <span className="text-[10px] font-semibold text-indigo-400">
                              {projects.find(p => p.id === task.projectId)?.title || 'Core'}
                            </span>
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-[9px] font-bold text-slate-400 group-hover:border-indigo-500/50 group-hover:text-indigo-300 transition-colors">
                            {task.developerId?.charAt(0).toUpperCase() || '?'}
                          </div>
                        </div>
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                      <div className="h-28 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 opacity-50 bg-white/[0.01]">
                        <span className="text-lg opacity-50">📋</span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Empty Queue</span>
                      </div>
                    )}
                  </div>
                </div>

              );
            })}
          </div>

          {/* Activity Column */}
          <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Events</h3>
               <button onClick={toggleUser} className="text-[9px] font-black text-violet-500 uppercase tracking-widest hover:underline transition-all">Identity: {currentUser.role}</button>
            </div>
            <ActivityFeed logs={auditLogs} />
            
            {currentUser.role === 'Admin' && (
              <button 
                onClick={() => setShowModal(true)}
                className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shadow-2xl shadow-white/5"
              >
                Initialize Task
              </button>
            )}
          </div>
        </div>
      ) : (
        <AnalyticsView stats={analytics?.stats} weeklyActivity={analytics?.weeklyActivity} />
      )}

      {/* Premium Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[40px] p-12 shadow-3xl animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">New Engineering Ticket</h2>
            <p className="text-slate-500 text-sm mb-10">Define the scope and assignee for this technical deliverable.</p>
            
            <form onSubmit={handleCreateTask} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                <input 
                  autoFocus required
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-violet-500/50 outline-none transition-all placeholder:text-slate-600"
                  placeholder="e.g. Implement WebSocket Handshake"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scope</label>
                  <select 
                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-5 text-white outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none"
                    value={newTask.projectId}
                    onChange={(e) => setNewTask(prev => ({ ...prev, projectId: e.target.value }))}
                  >
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lead</label>
                  <select className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-5 text-white outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none">
                    <option value="dev1">Alice (Senior Dev)</option>
                    <option value="dev2">Bob (Infrastructure)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-300 transition-colors">Dismiss</button>
                <button type="submit" className="flex-1 bg-violet-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-500 transition-all shadow-xl shadow-violet-600/20">Finalize</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
