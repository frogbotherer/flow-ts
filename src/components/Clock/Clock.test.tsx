import { render, screen, userEvent } from '@test-utils';
import { Clock } from './Clock';

describe('Clock component', () => {
  it('displays its name', () => {
    render(<Clock max={40} unit="h" />);
    expect(screen.getByRole('button')).toBeVisible();
  });

  it('has a slider that defaults to 1 unit, with a range from 0 to $max', () => {
    render(<Clock max={10} unit="unit" />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeVisible();
    expect(slider).toHaveAccessibleName('Clock');

    expect(slider.ariaValueMin).toBe('0');
    expect(slider.ariaValueNow).toBe('1');
    expect(slider.ariaValueMax).toBe('10');
  });

  it('has a button that decreases the clock by 1', async () => {
    render(<Clock max={10} unit="unit" />);
    const slider = screen.getByRole('slider');
    const button = screen.getByRole('button');

    expect(button).toBeVisible();
    expect(slider.ariaValueNow).toBe('1');

    await userEvent.click(button);

    expect(slider.ariaValueNow).toBe('0');

    await userEvent.click(button);
    expect(slider.ariaValueNow).toBe('0');
  });
});
