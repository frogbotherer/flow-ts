import { Receiver } from './Receiver';

/** sends WorkItems */
export interface Sender {
  // name
  name: string;

  // connect to a Receiver
  receiver: string | null;

  // whether the Sender is blocked from processing
  sendBlocked: boolean;

  // attempt to send WorkItem(s) to the set Receiver
  send: (systemState: Receiver, time: number) => void;
}
