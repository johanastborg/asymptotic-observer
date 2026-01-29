export interface Message {
  type: string;
  payload?: any;
  sender?: string;
  id?: string;
}

export interface IActorSystem {
  send(targetId: string, message: Message): void;
  broadcast(message: Message): void;
}

export abstract class Actor {
  public id: string;
  protected system: IActorSystem;

  constructor(id: string, system: IActorSystem) {
    this.id = id;
    this.system = system;
  }

  public abstract receive(message: Message): Promise<void>;
}
