import { VariabilityDistribution } from './VariabilityDistribution';

/**
 * an Erlang distribution, see https://www.statisticshowto.com/erlang-distribution/
 */
export class ErlangDistribution extends VariabilityDistribution {
  private _offset: number;
  private _shape: number;
  private _scale: number;
  private _cumulativeDist: Array<number> = [];

  private _factorial: Array<number> = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800];
  private _residual: number = 0.9999;

  // see https://www.statisticshowto.com/erlang-distribution/
  private _erlang = (x: number, k: number, u: number) =>
    (x ** (k - 1) * Math.exp(-x / u)) / (u ** k * this._factorial[k - 1]);

  constructor(shape: number, scale: number, offset: number = 0) {
    super();
    if (!(shape > 0 && shape < this._factorial.length && Number.isInteger(shape))) {
      throw Error(`shape must be an integer between 1 and ${this._factorial.length}, not ${shape}`);
    }
    if (!(scale > 0)) {
      throw Error(`scale must be > 0, not ${scale}`);
    }
    if (!(offset >= 0)) {
      throw Error(`offset must be >= 0, not ${offset}`);
    }
    this._offset = offset;
    this._shape = shape;
    // scale can be defined as 1/ number of items per unit of time
    // i.e. time per unit. the mean of the erlang pdf is shape*scale
    this._scale = scale;

    // build a cumulative distribution of erlang probability distribution fn
    // NB. the area under the pdf isn't 1.0, it's some other number that we calculate in settleTo
    const settleTo = Array.from(Array(100).keys())
      .map((x) => this._erlang(x, this._shape, this._scale))
      .reduce((a, b) => a + b);
    let cd = 0.0;
    let x = 0;
    while (cd < this._residual) {
      cd += this._erlang(x, this._shape, this._scale) / settleTo;
      x += 1;
      this._cumulativeDist.push(cd);
    }
  }

  generate(n: number) {
    const ret: Array<number> = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      const rng = this._rng();
      ret[i] =
        this._offset +
        this._cumulativeDist
          .map((v: number): number => (rng >= v ? 1 : 0))
          .reduce((p: number, c: number) => p + c);
    }
    return ret;
  }
}
