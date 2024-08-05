import { render, screen } from '@test-utils';
import { Welcome } from './Welcome';

describe('Welcome component', () => {
  it('has a title', () => {
    render(<Welcome />);
    expect(screen.getByText('Flow Thing')).toBeDefined();
  });
});
