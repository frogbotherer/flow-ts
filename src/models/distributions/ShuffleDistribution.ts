import { WorkItem } from '../WorkItem';
import { Distribution } from './Distribution';

/**
 * for shuffling according to different algorithms
 */
export abstract class ShuffleDistribution extends Distribution {
  // shuffle workitems in place
  abstract shuffle(workItems: Array<WorkItem>): void;
}
