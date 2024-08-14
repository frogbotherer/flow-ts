import { WorkItem } from './WorkItem';

/** receives WorkItems from a Sender */
export interface Receiver {
  // name
  name: string;

  // connect to one or more Senders
  senders: Array<string>;

  // whether the Receiver is blocked from processing
  receiveBlocked: boolean;

  // receive a WorkItem from the set sender
  receive: (workItem: WorkItem, time: number) => void;
}
