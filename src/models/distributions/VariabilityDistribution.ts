import { Distribution } from './Distribution';

/**
 * Interface for different kinds of variability distribution, used by queues.
 */
export abstract class VariabilityDistribution extends Distribution {
  // generate the next n values of this distribution
  abstract generate(n: number): number[];
  generateOne(): number {
    return this.generate(1)[0];
  }
}
