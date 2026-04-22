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
          <div key={log.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-slate-400">{log.userId.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-slate-200 truncate">
                    {log.userId} <span className="text-slate-500 font-normal">performed</span> {log.action}
                  </p>
                  <span className="text-[10px] text-slate-600 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{log.details}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-slate-800 text-slate-500 text-[9px] font-mono rounded">
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
