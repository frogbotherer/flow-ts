import { VariabilityDistribution } from './VariabilityDistribution';

/**
 * a flat distribution, i.e. y = x + n
 */
export class FlatDistribution extends VariabilityDistribution {
  private _x: number;

  constructor(x: number) {
    super();
    this._x = x;
  }

  generate(n: number) {
    const ret: Array<number> = new Array<number>(n);
    ret.fill(this._x);
    return ret;
  }
}
