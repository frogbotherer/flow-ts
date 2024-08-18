import { WorkItem } from '../WorkItem';
import { ShuffleDistribution } from './ShuffleDistribution';

/**
 * shuffle based on a hash of the workorder, i.e. round robin
 *  AAABBB    =>  ABABAB
 *  AAABBBCCC =>  ABCABCABC
 *  AAAABB    =>  ABABAA
 *  AAAABBC   =>  ABCABAA
 */
export class FaroShuffle extends ShuffleDistribution {
  shuffle(workItems: Array<WorkItem>): void {
    const newWorkItems: Array<WorkItem> = [];
    // map hash of workorder name to its workitems in the list
    const wiMap: Map<number, Array<WorkItem>> = new Map();
    for (const wi of workItems) {
      const h = this._hash(wi.workOrder.name);
      if (wiMap.get(h) === undefined) {
        wiMap.set(h, []);
      }
      wiMap.get(h)!.push(wi);
    }

    // find w/o with fewest items; woNames should contain w/o in order from smallest to biggest items
    const woNames = Array.from(wiMap.keys()).toSorted(
      (a: number, b: number) => wiMap.get(a)!.length - wiMap.get(b)!.length
    );

    // get items from each w/o in term until list exhausted
    let idx: number = 0;
    for (const woName of woNames) {
      while (idx < wiMap.get(woName)!.length) {
        for (const wo of woNames) {
          if (wiMap.get(wo)![idx] !== undefined) {
            newWorkItems.push(wiMap.get(wo)![idx]);
          }
        }
        idx += 1;
      }
    }

    // workItems = newWorkItems;
    for (let i = 0; i < newWorkItems.length; i++) {
      workItems[i] = newWorkItems[i];
    }
  }
}
