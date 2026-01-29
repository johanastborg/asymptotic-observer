import { NextRequest } from 'next/server';
import { system } from '@/lib/usm/system';
import { ensureSubjectC } from '@/lib/usm/processes/subject-c';
import { ensureDarkMatter } from '@/lib/usm/processes/dark-matter';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Ensure the Universal State Machine is running
  // In a real serverless env (like Cloud Run), this would run in a separate process/container.
  // Here we lazily init it in the same process.
  ensureSubjectC();
  ensureDarkMatter();

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (data: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          // Stream likely closed by client
        }
      };

      // Subscribe to the system
      const unsubscribe = system.subscribe((message) => {
        send(message);
      });

      // Send initial connection message
      send({ type: 'CONNECTED', payload: { message: 'Asymptotic Observer Linked to Universal State Machine' } });

      // Clean up when the client disconnects
      // The ReadableStream's cancel method is called when the client disconnects
      return () => {
        unsubscribe();
      };
    },
    cancel() {
        // This is called if the client cancels the stream
        // We can handle cleanup here if not handled in start return
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
