import { Card, Slider, ActionIcon, Group } from '@mantine/core';
import { IconClockPlay } from '@tabler/icons-react';
import { useState } from 'react';
import { observer } from 'mobx-react';
import { useSystemContext } from '../SystemContext/SystemContext';

interface ClockState {
  countDown: number;
}
type ClockProps = {
  max: number;
  unit: string;
};
export const Clock = observer(({ max, unit }: ClockProps) => {
  const [state, setState] = useState<ClockState>({ countDown: 1 });
  const setCountDown = (countDown: number) => setState({ countDown });
  const systemState = useSystemContext();

  function doCountDown() {
    if (state.countDown > 0) {
      setCountDown(state.countDown - 1);
      systemState.tick();
    }
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group grow>
        <Slider
          style={{ minWidth: 200 }}
          defaultValue={1}
          min={0}
          max={max}
          step={1}
          label={(value: number) => (
            <>
              {value}
              {unit}
            </>
          )}
          thumbLabel="Clock"
          value={state.countDown}
          onChange={setCountDown}
        />
        <ActionIcon aria-label="Start Clock" onClick={doCountDown}>
          <IconClockPlay />
        </ActionIcon>
      </Group>
    </Card>
  );
});
