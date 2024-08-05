import { FlatDistribution } from './FlatDistribution';

describe('FlatDistribution', () => {
  it('can generate a flat sequence', () => {
    const f: FlatDistribution = new FlatDistribution(5);
    expect(f.generate(3)).toEqual([5, 5, 5]);
  });
  it('does not raise an error on zero', () => {
    const f: FlatDistribution = new FlatDistribution(10);
    expect(f.generate(0)).toEqual([]);
  });
  it('fails when trying to generate a negative sequence', () => {
    const f: FlatDistribution = new FlatDistribution(10);
    expect(() => {
      f.generate(-5);
    }).toThrow('Invalid array length');
  });
});
