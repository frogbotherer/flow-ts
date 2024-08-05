import { createContext, PropsWithChildren, useContext } from 'react';
import { observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import { Receiver } from '@/models/Receiver';
import { Sender } from '@/models/Sender';

type SystemContextProps = {};

class SystemState {
  // NB. the ordering of senders is important; WorkItems should be consumed from right to left
  private senders: Map<string, Sender> = new Map();
  private receivers: Map<string, Receiver> = new Map();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  registerSender = (sender: Sender, sendTo?: string) => {
    this.senders.set(sender.name, sender);

    if (sendTo === undefined) {
      return;
    }

    const receiver = this.receivers.get(sendTo);
    if (receiver !== undefined) {
      sender.receiver = sendTo;
      receiver.sender = sender.name;
    } else {
      throw new TypeError(`Sender ${sender.name} links to receiver ${sendTo} that does not exist`);
    }
  };
  registerReceiver = (receiver: Receiver, receiveFrom?: string) => {
    this.receivers.set(receiver.name, receiver);

    if (receiveFrom === undefined) {
      return;
    }

    const sender = this.senders.get(receiveFrom);
    if (sender !== undefined) {
      receiver.sender = receiveFrom;
      sender.receiver = receiver.name;
    } else {
      throw new TypeError(
        `Receiver ${receiver.name} links to sender ${receiveFrom} that does not exist`
      );
    }
  };
  // the order in which things are processed will affect how the model works
  getOrderedSenders(): string[] {
    return Array.from(this.senders.keys()).reverse();
  }
  getSender(senderName: string): Sender | undefined {
    return this.senders.get(senderName);
  }
  getReceiver(receiverName: string): Receiver | undefined {
    return this.receivers.get(receiverName);
  }

  tick() {
    // * fetch a list of senders, ordered right-to-left
    // * for each sender, call sender.send()
    for (const senderName of this.getOrderedSenders()) {
      const s = this.getSender(senderName);
      if (s !== undefined && s.receiver !== null) {
        const r = this.getReceiver(s.receiver);
        if (r !== undefined) {
          s.send(r);
        }
      }
    }
  }
}

const initialState: SystemState = new SystemState();
const SystemContext = createContext<SystemState>(initialState);

export const SystemProvider = observer(({ children }: PropsWithChildren<SystemContextProps>) => (
  <SystemContext.Provider value={initialState}>{children}</SystemContext.Provider>
));

// custom hooks
export function useSystemContext() {
  return useContext(SystemContext);
}
