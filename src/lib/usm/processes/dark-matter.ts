import { Actor, Message } from '../actor';
import { system } from '../system';

export class DarkMatterVault extends Actor {
  private vault: any[] = [];

  constructor() {
    super('dark-matter', system);
  }

  public async receive(message: Message): Promise<void> {
    if (message.type === 'PERSIST') {
      this.vault.push(message.payload);
      // Keep vault size manageable
      if (this.vault.length > 50) this.vault.shift();

      console.log(`[Dark Matter] Vaulted state from ${message.sender}. Total records: ${this.vault.length}`);
    }
  }
}

let instance: DarkMatterVault | null = null;

export function ensureDarkMatter() {
  if (!instance) {
    instance = new DarkMatterVault();
    system.register(instance);
  }
  return instance;
}
