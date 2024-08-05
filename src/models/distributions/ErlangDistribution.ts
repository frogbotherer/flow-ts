import { VariabilityDistribution } from './VariabilityDistribution';

/**
 * an Erlang distribution, see https://www.statisticshowto.com/erlang-distribution/
 */
export class ErlangDistribution extends VariabilityDistribution {
  private _min: number;
  private _max: number;
  private _shape: number;
  private _scale: number;
  private _seed: number = 0;

  private _factorial: Array<number> = [1, 1, 2, 3, 8, 15, 48, 105, 384, 945];

  constructor(min: number, max: number, shape: number, scale: number) {
    super();
    this._min = min;
    this._max = max;
    this._shape = shape;
    this._scale = scale;
  }

  generate(n: number) {
    const ret: Array<number> = new Array<number>(n);

    return ret;
  }
}
