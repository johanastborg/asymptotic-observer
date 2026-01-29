import { Actor, Message } from '../actor';
import { system } from '../system';

interface State {
  reality: string;
  timestamp: number;
  entropy: number;
  quantumFlux: number;
}

export class SubjectC extends Actor {
  private state: State;

  constructor() {
    super('subject-c', system);
    this.state = {
      reality: 'Genesis',
      timestamp: Date.now(),
      entropy: 0,
      quantumFlux: Math.random()
    };
    this.startLifeCycle();
  }

  private startLifeCycle() {
    setInterval(() => {
      this.system.send(this.id, { type: 'EVOLVE' });
    }, 2000); // Evolve every 2 seconds
  }

  public async receive(message: Message): Promise<void> {
    switch (message.type) {
      case 'EVOLVE':
        this.state.entropy++;
        this.state.timestamp = Date.now();
        this.state.quantumFlux = Math.random();
        this.state.reality = `Epoch ${this.state.entropy} - Flux: ${this.state.quantumFlux.toFixed(4)}`;

        // Persist to Dark Matter
        this.system.send('dark-matter', {
            type: 'PERSIST',
            payload: { ...this.state },
            sender: this.id
        });

        // Broadcast Reality Update to the Universe (Observers)
        this.system.broadcast({
            type: 'REALITY_UPDATE',
            payload: this.state,
            sender: this.id
        });
        break;

      case 'PERTURB':
        console.log('[Subject C] Perturbation detected');
        this.state.entropy += 10;
        this.state.reality += ` [PERTURBED]`;
        this.system.broadcast({
            type: 'REALITY_UPDATE',
            payload: this.state,
            sender: this.id
        });
        break;
    }
  }
}

// Singleton instantiation
let instance: SubjectC | null = null;

export function ensureSubjectC() {
  if (!instance) {
    instance = new SubjectC();
    system.register(instance);
  }
  return instance;
}
