import { Card, Table, Text } from '@mantine/core';
import { observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import { Receiver } from '@/models/Receiver';
import { WorkItem } from '@/models/WorkItem';
import { useSystemContext } from '../SystemContext/SystemContext';
import { WorkOrder } from '@/models/WorkOrder';

type SinkProps = {
  name: string;
  receiveFrom?: string;
};

class SinkState implements Receiver {
  workOrders: WorkOrder[] = [];

  // receiver interface
  name: string;
  receiveBlocked: boolean = false;
  private _senders: Array<string> = [];

  get senders() {
    return this._senders;
  }
  set senders(senders) {
    this._senders = senders;
  }
  receive = (workItem: WorkItem, time: number) => {
    workItem.setDone(time);
    if (!this.workOrders.map((value: WorkOrder) => value.name).includes(workItem.workOrder.name)) {
      this.workOrders.push(workItem.workOrder);
    } else {
      // do something to workOrders to trigger a refresh
      const wo = this.workOrders.pop();
      if (wo !== undefined) {
        this.workOrders.push(wo);
      }
    }
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

  const tableData = state.workOrders.map((wo: WorkOrder) => (
    <Table.Tr key={wo.name}>
      <Table.Td>{wo.name}</Table.Td>
      <Table.Td ta="right">
        {wo.workItems
          .map((wi: WorkItem): number => (wi.done ? 1 : 0))
          .reduce((p: number, c: number) => p + c)}{' '}
        / {wo.workItems.length}
      </Table.Td>
      <Table.Td ta="right">{wo.duration}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={700}>Sink: {name}</Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order</Table.Th>
            <Table.Th>Items</Table.Th>
            <Table.Th>Duration</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{tableData}</Table.Tbody>
      </Table>
    </Card>
  );
});
