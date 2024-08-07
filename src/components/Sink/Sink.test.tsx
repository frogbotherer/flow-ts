import { render, screen } from '@test-utils';
import { Sink } from './Sink';

describe('Sink component', () => {
  it('displays its name', () => {
    render(<Sink name="test" />);
    expect(screen.getByText('Sink: test')).toBeVisible();
  });
});
