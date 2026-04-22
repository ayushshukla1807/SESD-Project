'use client';

interface AnalyticsViewProps {
  stats: {
    totalProjects: number;
    totalTasks: number;
    completedPercentage: number;
    activeDevelopers: number;
  };
  weeklyActivity: { day: string; tasks: number }[];
}

export default function AnalyticsView({ stats, weeklyActivity }: AnalyticsViewProps) {
  const maxTasks = Math.max(...weeklyActivity.map(d => d.tasks));

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: stats.totalProjects, color: 'text-indigo-400' },
          { label: 'Total Tickets', value: stats.totalTasks, color: 'text-violet-400' },
          { label: 'Completion Velocity', value: `${stats.completedPercentage.toFixed(1)}%`, color: 'text-fuchsia-400' },
          { label: 'Active Contributors', value: stats.activeDevelopers, color: 'text-rose-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-colors">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Throughput Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-md">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-8">Weekly Engineering Throughput</h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {weeklyActivity.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div 
                  className="w-full bg-gradient-to-t from-violet-600/20 to-violet-500/60 rounded-t-lg transition-all duration-500 group-hover:to-violet-400 group-hover:from-violet-500/40"
                  style={{ height: `${(day.tasks / maxTasks) * 100}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity -top-8 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded absolute">
                    {day.tasks}
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-500 uppercase">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">System Health</h3>
            <p className="text-xs text-slate-500 mb-6">Real-time infrastructure and delivery status.</p>
          </div>
          
          <div className="space-y-6">
            {[
              { label: 'API Latency', value: '14ms', status: 'Stable' },
              { label: 'DB Uptime', value: '99.98%', status: 'Healthy' },
              { label: 'Deployment Pipeline', value: 'Passed', status: 'Active' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-200">{item.label}</p>
                  <p className="text-[10px] text-slate-500">{item.value}</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-tighter rounded border border-emerald-500/20">
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors">
              Download Full Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
