import { RandomDistribution } from './RandomDistribution';

describe('RandomDistribution', () => {
  it('can generate a random-ish sequence', () => {
    const f: RandomDistribution = new RandomDistribution(0, 99);
    expect(f.generate(10)).toEqual([86, 69, 46, 15, 95, 28, 38, 87, 74, 12]);
  });
  it('does not raise an error on zero', () => {
    const f: RandomDistribution = new RandomDistribution(0, 10);
    expect(f.generate(0)).toEqual([]);
  });
  it('hits the min and max clipping bounds', () => {
    const f: RandomDistribution = new RandomDistribution(2, 4);
    const seq = f.generate(100);
    expect(Math.min(...seq)).toEqual(2);
    expect(Math.max(...seq)).toEqual(4);
  });
  it('fails when trying to generate a negative sequence', () => {
    const f: RandomDistribution = new RandomDistribution(0, 10);
    expect(() => {
      f.generate(-5);
    }).toThrow('Invalid array length');
  });
});
