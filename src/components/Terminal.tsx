'use client';
import { useEffect, useState, useRef } from 'react';

export default function Terminal() {
  const [logs, setLogs] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLogs((prev) => [...prev.slice(-99), data]); // Keep last 100 logs
      } catch (e) {
        console.error('Error parsing SSE data', e);
      }
    };

    eventSource.onerror = (e) => {
        console.error("SSE Error", e);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="font-mono bg-black text-green-400 p-4 h-full overflow-y-auto border border-green-800 rounded shadow-[0_0_20px_rgba(0,255,0,0.2)]">
      {logs.map((log, i) => (
        <div key={i} className="mb-2 border-b border-green-900 pb-1">
            <div className="flex gap-2 text-xs opacity-70 mb-1">
                 <span>{new Date().toLocaleTimeString()}</span>
                 <span className="text-yellow-500 font-bold">{log.type}</span>
                 <span className="text-blue-400">{log.sender ? `<${log.sender}>` : ''}</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm mt-1 text-green-300">
                {JSON.stringify(log.payload, null, 2)}
            </pre>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
