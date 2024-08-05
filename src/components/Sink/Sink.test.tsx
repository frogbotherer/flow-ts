import { render, screen } from '@test-utils';
import { Sink } from './Sink';

describe('Sink component', () => {
  it('displays its name', () => {
    render(<Sink name="test" />);
    expect(screen.getByText('Sink: test')).toBeVisible();
  });

  it('has zero work items by default', () => {
    render(<Sink name="test" />);
    expect(screen.getByText(/received.*0/i)).toBeVisible();
  });
});
