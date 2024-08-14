import { Card, RingProgress, Text } from '@mantine/core';
import { observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import { Sender } from '@/models/Sender';
import { useSystemContext } from '../SystemContext/SystemContext';
import { Receiver } from '@/models/Receiver';
import { WorkItem } from '@/models/WorkItem';

/**
 * state of the mixer
 *
 * NB. only exported so it can be tested :-\
 */
export class MixerState implements Sender, Receiver {
  public name: string;
  workItems: WorkItem[] = [];
  private _needsShuffle: boolean = false;

  constructor(name: string) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.name = name;
  }
  private _senders: Array<string> = [];
  private _receiver: string | null = null;
  private _sendBlocked: boolean = false;
  get receiver() {
    return this._receiver;
  }
  set receiver(receiver: string | null) {
    this._receiver = receiver;
  }
  get senders() {
    return this._senders;
  }
  set senders(senders: Array<string>) {
    this._senders = senders;
  }
  get receiveBlocked() {
    // always receive workitems
    return false;
  }
  receive(workItem: WorkItem) {
    this.workItems.unshift(workItem);
    this._needsShuffle = true;
  }
  get sendBlocked() {
    return this._sendBlocked;
  }
  send(receiver: Receiver, time: number) {
    if (this._needsShuffle) {
      this.workItems.sort(() => this._rng() - 0.5);
      this._needsShuffle = false;
    }
    while (this.workItems.length > 0) {
      this._sendBlocked = receiver.receiveBlocked;
      if (this._sendBlocked) {
        break;
      }
      const wi = this.workItems.pop();
      receiver.receive(wi!, time);
    }
  }

  get ringData(): Array<{ value: number; color: string; tooltip: string }> {
    const rd: Map<string, number> = new Map();
    for (const wi of this.workItems) {
      rd.set(wi.workOrder.name, 1 + (rd.get(wi.workOrder.name) || 0));
    }

    // TODO REFACTOR ME
    const colours = ['red', 'green', 'blue', 'orange', 'yellow', 'violet', 'indigo'];

    return Array.from(rd.entries()).map((v: [string, number]) => ({
      value: Math.round((v[1] * 100) / this.workItems.length),
      tooltip: `${v[0]}: ${v[1]}`,
      color: colours.pop()!,
    }));
  }

  // TODO REFACTOR ME
  // a seedable prng because js doesn't have one(!)
  // from: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
  private sfc32(a: number, b: number, c: number, d: number) {
    return () => {
      a |= 0;
      b |= 0;
      c |= 0;
      d |= 0;
      const t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }
  private _SEED = 0x5caff1e5;
  private _rng = this.sfc32(0, this._SEED >> 0, this._SEED >> 32, 1);
}

type MixerProps = {
  name: string;
  sendTo?: string;
  receiveFromA?: string;
  receiveFromB?: string;
};

export const Mixer = observer(({ name, sendTo, receiveFromA, receiveFromB }: MixerProps) => {
  const systemState = useSystemContext();
  let state: MixerState | undefined = systemState.getSender(name) as MixerState;

  // one or both receivers will be defined; sender may be defined (!!)
  if (state === undefined) {
    // register this source as something that sends WorkItems
    state = new MixerState(name);
    systemState.registerSender(state, sendTo);
  }
  if (systemState.getReceiver(name) === undefined) {
    // register this source as something that receives WorkItems
    systemState.registerReceiver(state, receiveFromA);
    systemState.registerReceiver(state, receiveFromB);
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={700}>Mixer: {name}</Text>
      <RingProgress size={80} sections={state.ringData} />
    </Card>
  );
});
