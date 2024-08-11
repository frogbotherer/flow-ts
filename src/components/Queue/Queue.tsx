import { Card, Text, RingProgress, Group, Popover, Button, NumberInput } from '@mantine/core';
import { observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import { IconSettingsFilled } from '@tabler/icons-react';
import { Receiver } from '@/models/Receiver';
import { WorkItem } from '@/models/WorkItem';
import { useSystemContext } from '../SystemContext/SystemContext';
import { Sender } from '@/models/Sender';
import { VariabilityDistribution } from '@/models/distributions/VariabilityDistribution';
import { ErlangDistribution } from '@/models/distributions/ErlangDistribution';

/**
Things that a queue should model:
 * different queueing discipline: FIFO, HDCF, SJF, WSJF, MSTF
 * cost of delay, cost of processing, [holding cost, transaction cost], cost of transit, value of output
 * variability distributions: erlang2, poisson, fixed, random
 * work rate
 * congestion (speed - throughput - density)
 * WIP limits, pull, blocking
 * economic payoff function vs. variability

Things that a queue should visualise:
 * size of the queue
 * progress of current workitem
 * batches that each workitem belongs to
 * % utilisation; profitability
 */

/**
 * stateful part of the queue, including mid-model changes
 */
class QueueState implements Sender, Receiver {
  workItems: WorkItem[] = [];
  private _variabilityDistribution: VariabilityDistribution;
  private _capacity: number;
  static WORKING_HOURS: number = 8; // working hours in a day

  name: string;
  blocked: boolean = false;
  private _sender: string | null = null;
  private _receiver: string | null = null;
  get receiver() {
    return this._receiver;
  }
  set receiver(receiver: string | null) {
    this._receiver = receiver;
  }
  get sender() {
    return this._sender;
  }
  set sender(sender: string | null) {
    this._sender = sender;
  }
  send = (receiver: Receiver, time: number) => {
    // fifo for now
    // NB. we need to pop and push on every call to "dirty" .workItems and trigger a
    //     re-render of the Queue
    let cap = this._capacity * QueueState.WORKING_HOURS;
    while (cap > 0) {
      const wi = this.workItems.pop();
      if (wi === undefined) {
        // this will happen if workItems is empty whilst there's capacity remaining
        break;
      }

      const effort = wi.doEffort(cap, time);
      cap -= effort;

      if (wi.effortRemaining === 0) {
        receiver.receive(wi, time);
      } else {
        this.workItems.push(wi);
      }
    }
  };
  receive = (workItem: WorkItem, time: number) => {
    // when we receive a WorkItem, calculate how much effort it will take to
    // process, based on the VariabilityDistribution.
    workItem.setEffort(this.name, this._variabilityDistribution.generateOne(), time);
    this.workItems.unshift(workItem);
  };

  get capacity() {
    return this._capacity;
  }
  set capacity(cap: number | string) {
    this._capacity = +cap;
  }

  /**
   * % WIP inside the queueing process
   */
  get wipPc(): number {
    const wi = this.workItems.at(-1);
    if (wi === undefined) {
      return 0;
    }
    return Math.floor((100 * wi.effortExpended) / wi.effortRequired);
  }
  get wipText(): string {
    const wi = this.workItems.at(-1);
    if (wi === undefined) {
      return '-';
    }
    return `${wi.effortExpended}/${wi.effortRequired}`;
  }

  constructor(name: string, capacity: number) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.name = name;

    // TODO softcode all this
    //this._variabilityDistribution = new RandomDistribution(4, 40);
    this._variabilityDistribution = new ErlangDistribution(2, 10);

    this._variabilityDistribution.seed(name);
    this._capacity = capacity;
  }
}

/**
 * props that define the behaviour of the model
 */
type QueueProps = {
  name: string;
  sendTo?: string;
  receiveFrom?: string;
};

/**
 * react UI element and bindings
 */
export const Queue = observer(({ name, sendTo, receiveFrom }: QueueProps) => {
  const systemState = useSystemContext();

  // the queue needs to be both a sender and a receiver.
  // one or both of sendTo and receiveFrom may be set
  let state: QueueState | undefined = systemState.getSender(name) as QueueState;
  if (state === undefined) {
    // register this source as something that sends WorkItems
    state = new QueueState(name, 2);
    systemState.registerSender(state, sendTo);
  }
  if (systemState.getReceiver(name) === undefined) {
    // register this source as something that receives WorkItems
    systemState.registerReceiver(state, receiveFrom);
  }

  const setCapacity = (capacity: string | number) => {
    state.capacity = capacity;
  };
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={700}>Queue: {name}</Text>
      <Group>
        <Text size="sm" c="dimmed">
          {state.workItems.length} work items
        </Text>
        <RingProgress
          size={80}
          label={
            <Text size="xs" c="blue" ta="center">
              {state.wipText}
            </Text>
          }
          sections={[{ value: state.wipPc, color: 'blue' }]}
        />
      </Group>
      <Popover shadow="sm" trapFocus>
        <Popover.Target>
          <Button rightSection={<IconSettingsFilled />}>Configure</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <NumberInput
            label="Capacity"
            description="Number of team members"
            placeholder="2"
            min={1}
            allowDecimal={false}
            allowNegative={false}
            value={state.capacity}
            onChange={setCapacity}
          />
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
});
