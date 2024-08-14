import { Group, Space } from '@mantine/core';
import { observer } from 'mobx-react';
import { Welcome } from '../components/Welcome/Welcome';
import { Source } from '../components/Source/Source';
import { Sink } from '../components/Sink/Sink';
import { Clock } from '../components/Clock/Clock';
import { SystemProvider } from '../components/SystemContext/SystemContext';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Queue } from '@/components/Queue/Queue';
import { ErlangDistribution } from '@/models/distributions/ErlangDistribution';

export const HomePage = observer(() => (
  <>
    <Welcome />
    <SystemProvider>
      <Space h="xl" />
      <Group justify="center" align="start">
        <Source name="Input" />
        <Queue name="Design" receiveFrom="Input" distribution={new ErlangDistribution(2, 10)} />
        <Queue name="Build" receiveFrom="Design" distribution={new ErlangDistribution(2, 10)} />
        <Queue name="Test" receiveFrom="Build" distribution={new ErlangDistribution(2, 10)} />
        <Sink name="Output" receiveFrom="Test" />
      </Group>
      <Space h="xl" />
      <Group justify="center">
        <Clock max={20} unit="d" />
      </Group>
    </SystemProvider>
    <ColorSchemeToggle />
  </>
));
