/**
 * an abstract base class for different distributions, used for queues, mixing and other random-ish processes
 */
export abstract class Distribution {
  constructor() {
    this.seed(0xdecafbad);
  }

  // rng
  protected _rng(): number {
    return 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _hash(s: string): number {
    return 0;
  }

  // seed the distribution rng for consistency
  seed(n: number | string) {
    if (typeof n === 'string') {
      n = this.cyrb53(0xfeedbeef)(n);
    }
    this._rng = this.sfc32(0, n >> 0, n >> 32, 1);
    this._hash = this.cyrb53(n);
  }

  // a seedable prng because js doesn't have one(!)
  // from: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
  private sfc32(a: number, b: number, c: number, d: number) {
    return () => {
      a |= 0;
      b |= 0;
      c |= 0;
      d |= 0;
      const t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  // a string hashing function because js doesn't have one either
  // from: https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
  private cyrb53(seed: number = 0) {
    return (str: string) => {
      let h1 = 0xdeadbeef ^ seed;
      let h2 = 0x41c6ce57 ^ seed;
      for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
      h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
      h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };
  }
}
