import { Card, Text } from '@mantine/core';
import { observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import { Receiver } from '@/models/Receiver';
import { WorkItem } from '@/models/WorkItem';
import { useSystemContext } from '../SystemContext/SystemContext';

type SinkProps = {
  name: string;
  receiveFrom?: string;
};

class SinkState implements Receiver {
  workItems: WorkItem[] = [];

  // receiver interface
  name: string;
  blocked: boolean = false;
  private _sender: string | null = null;

  get sender() {
    return this._sender;
  }
  set sender(sender: string | null) {
    this._sender = sender;
  }
  receive = (workItem: WorkItem) => {
    this.workItems.push(workItem);
  };

  constructor(name: string) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.name = name;
  }
}

export const Sink = observer(({ name, receiveFrom }: SinkProps) => {
  const systemState = useSystemContext();

  let state: SinkState | undefined = systemState.getReceiver(name) as SinkState;
  if (state === undefined) {
    // register this source as something that receives WorkItems
    state = new SinkState(name);
    systemState.registerReceiver(state, receiveFrom);
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={700}>Sink: {name}</Text>
      <Text size="sm" c="dimmed">
        Received: {state.workItems.length} work items
      </Text>
    </Card>
  );
});
