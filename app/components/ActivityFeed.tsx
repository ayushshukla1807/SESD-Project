'use client';

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  userId: string;
  entityType: string;
  details: string;
}

export default function ActivityFeed({ logs }: { logs: AuditLogEntry[] }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Activity Feed</h3>
        <span className="text-[10px] text-blue-500 font-mono animate-pulse">LIVE</span>
      </div>
      <div className="divide-y divide-slate-800/50 max-h-[400px] overflow-y-auto custom-scrollbar">
        {logs.map((log) => (
          <div key={log.id} className="px-6 py-5 hover:bg-white/[0.03] transition-colors group">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-violet-500/50 transition-colors">
                <span className="text-[10px] font-black text-slate-400 group-hover:text-violet-400">{log.userId.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] font-black text-slate-200 truncate tracking-tight">
                    {log.userId} <span className="text-slate-500 font-medium">→</span> <span className="text-violet-400">{log.action}</span>
                  </p>
                  <span className="text-[9px] font-bold text-slate-600 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 italic">"{log.details}"</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white/5 text-slate-400 text-[8px] font-black uppercase tracking-[0.1em] rounded border border-white/5">
                    {log.entityType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
