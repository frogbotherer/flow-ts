import { Card, Button, Text, Popover, NativeSelect, NumberInput } from '@mantine/core';
import { IconSettingsFilled } from '@tabler/icons-react';
import { observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import { Sender } from '@/models/Sender';
import { useSystemContext } from '../SystemContext/SystemContext';
import { WorkOrder } from '@/models/WorkOrder';
import { Receiver } from '@/models/Receiver';

type Model = 'Linear' | 'Poisson' | 'Erlang2';

class SourceState implements Sender {
  private _batchSize: number = 10;
  private _model: Model = 'Erlang2';

  // Sender interface
  blocked: boolean = false;
  name: string;
  private _receiver: string | null = null;
  get receiver() {
    return this._receiver;
  }
  set receiver(receiver: string | null) {
    this._receiver = receiver;
  }
  send = (receiver: Receiver, time: number) => {
    // * generate some workItems to send, based on batchSize and model
    const wo = new WorkOrder(this.batchSize, `${this.name}-${time}`, time);
    // * call receiver.receive on each item
    for (const wi of wo.workItems) {
      receiver.receive(wi, time);
    }
    this.batchSize = 0;
  };

  constructor(name: string) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.name = name;
  }

  get model() {
    return this._model;
  }
  set model(model: string | Model) {
    if (this.isModel(model)) {
      this._model = model;
    }
  }
  private isModel(s: string): s is Model {
    return ['Linear', 'Poisson', 'Erlang2'].includes(s);
  }

  public get batchSize(): number {
    return this._batchSize;
  }
  public set batchSize(value: string | number) {
    this._batchSize = +value;
  }
}

type SourceProps = {
  name: string;
  sendTo?: string;
};

export const Source = observer(({ name, sendTo }: SourceProps) => {
  const systemState = useSystemContext();
  let state: SourceState | undefined = systemState.getSender(name) as SourceState;

  if (state === undefined) {
    // register this source as something that sends WorkItems
    state = new SourceState(name);
    systemState.registerSender(state, sendTo);
  }

  const setBatchSize = (batchSize: string | number) => {
    state.batchSize = batchSize;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={700}>Source: {name}</Text>
      <Text size="sm" c="dimmed">
        {state.batchSize}
      </Text>
      <Popover shadow="sm" trapFocus>
        <Popover.Target>
          <Button rightSection={<IconSettingsFilled />}>Configure</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <NumberInput
            label="Batch Size"
            description="Batch of new work items"
            placeholder="10"
            min={0}
            allowDecimal={false}
            allowNegative={false}
            value={state.batchSize}
            onChange={setBatchSize}
          />
          <NativeSelect
            label="Distribution Model"
            description="Distribution model for new work items"
            data={['Linear', 'Poisson', 'Erlang2']}
            value={state.model}
            onChange={(event) => {
              state.model = event.currentTarget.value;
            }}
          />
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
});
