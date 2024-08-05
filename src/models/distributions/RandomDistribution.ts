import { VariabilityDistribution } from './VariabilityDistribution';

/**
 * a pseudo-random distribution between min and max INCLUSIVE
 */
export class RandomDistribution extends VariabilityDistribution {
  private _min: number;
  private _max: number;

  constructor(min: number, max: number) {
    super();
    this._min = min;
    this._max = max + 1;
  }

  generate(n: number) {
    const ret: Array<number> = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      ret[i] = Math.floor(this._rng() * (this._max - this._min) + this._min);
    }
    return ret;
  }
}
