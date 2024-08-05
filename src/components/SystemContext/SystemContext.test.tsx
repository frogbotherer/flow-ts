import { render, screen, userEvent } from '@test-utils';

import { Sink } from '../Sink/Sink';
import { SystemProvider } from './SystemContext';
import { Source } from '../Source/Source';
import { Clock } from '../Clock/Clock';

describe('SystemProvider component', () => {
  it('does not crash immediately', () => {
    render(
      <SystemProvider>
        <Sink name="test" />
      </SystemProvider>
    );
    expect(screen.getByText('Sink: test')).toBeVisible();
  });
  it('integrates a source, sink and clock', async () => {
    render(
      <SystemProvider>
        <Source name="input" />
        <Sink name="output" receiveFrom="input" />
        <Clock max={10} unit="u" />
      </SystemProvider>
    );
    const clockButton = screen.getByLabelText('Start Clock');
    const configButton = screen.getByRole('button', { name: 'Configure' });
    const clockSlider = screen.getByRole('slider');
    await userEvent.click(clockButton);

    // clock should count down to zero
    expect(clockSlider.ariaValueNow).toBe('0');
    // zero work items should be in the source
    await userEvent.click(configButton);
    await screen.findByText('Batch Size');

    expect(screen.getByRole('textbox', { name: 'Batch Size' })).toHaveValue('0');
    // 10 work items should appear in the sink
    expect(screen.getByText(/received.*10/i)).toBeVisible();
  });
});
