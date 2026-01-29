import { Actor, IActorSystem, Message } from './actor';

export class ActorSystem implements IActorSystem {
  private actors: Map<string, Actor> = new Map();
  private subscribers: ((message: Message) => void)[] = [];

  register(actor: Actor) {
    this.actors.set(actor.id, actor);
    console.log(`[ActorSystem] Registered actor: ${actor.id}`);
  }

  send(targetId: string, message: Message) {
    const actor = this.actors.get(targetId);
    if (actor) {
      // Simulate async message passing
      setTimeout(() => actor.receive(message), 0);
    } else {
      console.warn(`[ActorSystem] Actor ${targetId} not found`);
    }
  }

  /**
   * Broadcasts a message to the "Outside World" (Next.js Observers)
   */
  broadcast(message: Message) {
    this.subscribers.forEach(sub => sub(message));
  }

  subscribe(callback: (message: Message) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }
}

// Singleton instance
// Note: In Next.js dev mode, this might get re-instantiated on hot reloads.
// For production, this is fine. For dev, we might need a global variable hack.
const globalForSystem = global as unknown as { actorSystem: ActorSystem };

export const system = globalForSystem.actorSystem || new ActorSystem();

if (process.env.NODE_ENV !== 'production') globalForSystem.actorSystem = system;
