import { Group } from '@mantine/core';
import { observer } from 'mobx-react';
import { Welcome } from '../components/Welcome/Welcome';
import { Source } from '../components/Source/Source';
import { Sink } from '../components/Sink/Sink';
import { Clock } from '../components/Clock/Clock';
import { SystemProvider } from '../components/SystemContext/SystemContext';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Queue } from '@/components/Queue/Queue';

export const HomePage = observer(() => (
  <>
    <Welcome />
    <SystemProvider>
      <Group justify="center">
        <Source name="Input" />
        <Queue name="Design" receiveFrom="Input" />
        <Queue name="Build" receiveFrom="Design" />
        <Sink name="Output" receiveFrom="Build" />
      </Group>
      <Group justify="center">
        <Clock max={20} unit="d" />
      </Group>
    </SystemProvider>
    <ColorSchemeToggle />
  </>
));
