import { render, screen, userEvent } from '@test-utils';
import { Source } from './Source';

describe('Source component', () => {
  it('displays its name', () => {
    render(<Source name="test" />);
    expect(screen.getByText('Source: test')).toBeVisible();
  });

  it('has a config button', () => {
    render(<Source name="test" />);
    expect(screen.getByRole('button', { name: 'Configure' })).toBeVisible();
  });

  // default batch size is 10
  it('has a default batch size of 10', async () => {
    render(<Source name="test" />);
    const configButton = screen.getByRole('button', { name: 'Configure' });

    await userEvent.click(configButton);
    await screen.findByText('Batch Size');

    expect(screen.getByRole('textbox', { name: 'Batch Size' })).toHaveValue('10');
  });

  // incrementing the batch size works
  it('can change the batch size', async () => {
    render(<Source name="test" />);
    const configButton = screen.getByRole('button', { name: 'Configure' });
    await userEvent.click(configButton);
    await screen.findByText('Batch Size');

    // type 25 in the box then close and reopen the popover
    const batchSize = screen.getByRole('textbox', { name: 'Batch Size' });
    await userEvent.clear(batchSize);
    await userEvent.type(batchSize, '25');
    await userEvent.click(configButton);
    await userEvent.click(configButton);

    expect(batchSize).toHaveValue('25');
  });

  // setting the batch size to 0 fails
  // default model is sensible
  // changing the model works
  it('can change the model', async () => {
    render(<Source name="test" />);
    const configButton = screen.getByRole('button', { name: 'Configure' });
    await userEvent.click(configButton);
    await screen.findByText('Distribution Model');

    // type 25 in the box then close and reopen the popover
    const distModel = screen.getByRole('combobox', { name: 'Distribution Model' });
    expect(distModel).toHaveValue('Erlang2');

    await userEvent.selectOptions(distModel, 'Poisson');
    await userEvent.click(configButton);
    await userEvent.click(configButton);

    expect(distModel).toHaveValue('Poisson');
  });
});
