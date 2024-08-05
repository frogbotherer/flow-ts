import { render, screen } from '@test-utils';
import { Queue } from './Queue';

describe('Queue component', () => {
  it('displays its name', () => {
    render(<Queue name="test" />);
    expect(screen.getByText('Queue: test')).toBeVisible();
  });
});
