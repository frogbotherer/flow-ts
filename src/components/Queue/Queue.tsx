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
 *
 * NB. only exported from the module so we can test it >:(
 */
export class QueueState implements Sender, Receiver {
  workItems: WorkItem[] = [];
  private _variabilityDistribution: VariabilityDistribution;
  private _capacity: number;
  private _wipLimit: number;
  private _sendBlocked: boolean = false;
  static WORKING_HOURS: number = 8; // working hours in a day

  name: string;
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
    this._sendBlocked = receiver.receiveBlocked;

    while (cap > 0) {
      const wi = this.workItems.pop();
      if (wi === undefined) {
        // this will happen if workItems is empty whilst there's capacity remaining
        break;
      }

      const effort = wi.doEffort(cap, time);
      cap -= effort;

      if (wi.effortRemaining === 0) {
        if (receiver.receiveBlocked) {
          // if we can't send the current items downstream; stop
          this.workItems.push(wi);
          break;
        }
        receiver.receive(wi, time);
      } else {
        this.workItems.push(wi);
      }
    }
  };
  receive = (workItem: WorkItem, time: number) => {
    // when we receive a WorkItem, calculate how much effort it will take to
    // process, based on the VariabilityDistribution.
    if (this.receiveBlocked) {
      throw Error(`attempted to exceed wip limit of ${this.name} with ${workItem}`);
    }
    workItem.setEffort(this.name, this._variabilityDistribution.generateOne(), time);
    this.workItems.unshift(workItem);
  };

  get capacity() {
    return this._capacity;
  }
  set capacity(cap: number | string) {
    this._capacity = +cap;
  }
  get wipLimit() {
    return this._wipLimit;
  }
  set wipLimit(limit: number | string) {
    this._wipLimit = +limit;
  }

  /**
   * WIP limit implementation
   *  _wipLimit = 0   -> any sized backlog is fine
   *  _wipLimit > 0   -> backlog should not be larger than _wipLimit
   */
  get receiveBlocked() {
    return this._wipLimit > 0 && this.workItems.length >= this._wipLimit;
  }
  get sendBlocked() {
    return this._sendBlocked;
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

  constructor(
    name: string,
    distribution: VariabilityDistribution,
    capacity: number,
    wipLimit: number = 0
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.name = name;

    // TODO softcode all this
    //this._variabilityDistribution = new RandomDistribution(4, 40);
    // new ErlangDistribution(2, 10);
    this._variabilityDistribution = distribution;

    this._variabilityDistribution.seed(name);
    this._capacity = capacity;
    this._wipLimit = wipLimit;
  }
}

/**
 * props that define the behaviour of the model
 */
type QueueProps = {
  name: string;
  sendTo?: string;
  receiveFrom?: string;
  distribution?: VariabilityDistribution;
};

/**
 * react UI element and bindings
 */
export const Queue = observer(({ name, sendTo, receiveFrom, distribution }: QueueProps) => {
  const systemState = useSystemContext();

  // if distribution is undefined ...
  if (distribution === undefined) {
    distribution = new ErlangDistribution(2, 10);
  }

  // the queue needs to be both a sender and a receiver.
  // one or both of sendTo and receiveFrom may be set
  let state: QueueState | undefined = systemState.getSender(name) as QueueState;
  if (state === undefined) {
    // register this source as something that sends WorkItems
    state = new QueueState(name, distribution, 2);
    systemState.registerSender(state, sendTo);
  }
  if (systemState.getReceiver(name) === undefined) {
    // register this source as something that receives WorkItems
    systemState.registerReceiver(state, receiveFrom);
  }

  const setCapacity = (capacity: string | number) => {
    state.capacity = capacity;
  };
  const setWipLimit = (limit: string | number) => {
    state.wipLimit = limit;
  };
  const sendColour = state.sendBlocked ? 'red' : 'blue';
  const receiveColour = state.receiveBlocked ? 'red' : 'blue';
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={700}>Queue: {name}</Text>
      <Group>
        <Text size="sm" c={receiveColour}>
          <b>{state.workItems.length}</b> work item{state.workItems.length !== 1 ? 's' : ''}
        </Text>
        <RingProgress
          size={80}
          label={
            <Text size="xs" c={sendColour} ta="center">
              {state.wipText}
            </Text>
          }
          sections={[{ value: state.wipPc, color: sendColour }]}
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
          <NumberInput
            label="WIP Limit"
            description="Max number of queued items"
            placeholder="0"
            min={0}
            allowDecimal={false}
            allowNegative={false}
            value={state.wipLimit}
            onChange={setWipLimit}
          />
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
});
