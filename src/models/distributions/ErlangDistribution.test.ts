import { ErlangDistribution } from './ErlangDistribution';

describe('FlatDistribution', () => {
  it('can generate an erlang(7, 0.5) sequence', () => {
    const f: ErlangDistribution = new ErlangDistribution(7, 0.5);
    const hundred = f.generate(100);
    expect(hundred.filter((v: number) => v === 0).length).toEqual(0);
    expect(hundred.filter((v: number) => v === 2).length).toEqual(21);
    expect(hundred.filter((v: number) => v === 3).length).toEqual(31);
    expect(hundred.filter((v: number) => v === 4).length).toEqual(24);
    expect(hundred.filter((v: number) => v === 6).length).toEqual(4);
  });
  it('can generate an erlang(1, 2.0) sequence', () => {
    const f: ErlangDistribution = new ErlangDistribution(1, 2.0);
    const hundred = f.generate(100);
    expect(hundred.filter((v: number) => v === 0).length).toEqual(41);
    expect(hundred.filter((v: number) => v === 2).length).toEqual(15);
    expect(hundred.filter((v: number) => v === 3).length).toEqual(6);
    expect(hundred.filter((v: number) => v === 4).length).toEqual(7);
    expect(hundred.filter((v: number) => v === 6).length).toEqual(2);
  });

  it('can generate an erlang(9, 1.0) sequence', () => {
    const f: ErlangDistribution = new ErlangDistribution(9, 1.0);
    const hundred = f.generate(100);
    expect(hundred.filter((v: number) => v === 0).length).toEqual(0);
    expect(hundred.filter((v: number) => v === 4).length).toEqual(8);
    expect(hundred.filter((v: number) => v === 6).length).toEqual(11);
    expect(hundred.filter((v: number) => v === 8).length).toEqual(11);
    expect(hundred.filter((v: number) => v === 10).length).toEqual(11);
    expect(hundred.filter((v: number) => v === 12).length).toEqual(8);
    expect(hundred.filter((v: number) => v === 14).length).toEqual(2);
  });
  it('adds an offset to the distribution', () => {
    const f: ErlangDistribution = new ErlangDistribution(7, 0.5, 10);
    const hundred = f.generate(100);
    expect(hundred.filter((v: number) => v === 10).length).toEqual(0);
    expect(hundred.filter((v: number) => v === 12).length).toEqual(21);
    expect(hundred.filter((v: number) => v === 13).length).toEqual(31);
    expect(hundred.filter((v: number) => v === 14).length).toEqual(24);
    expect(hundred.filter((v: number) => v === 16).length).toEqual(4);
  });

  it('does not raise an error on zero', () => {
    const f: ErlangDistribution = new ErlangDistribution(2, 1.0);
    expect(f.generate(0)).toEqual([]);
  });
  it('fails when trying to generate a negative sequence', () => {
    const f: ErlangDistribution = new ErlangDistribution(2, 1.0);
    expect(() => {
      f.generate(-5);
    }).toThrow('Invalid array length');
  });
});
