import { WorkItem } from './WorkItem';

/** WorkOrders are groups of WorkItems, and contain useful information about how the WorkItems should be treated */
export class WorkOrder {
  size: number;
  workItems: WorkItem[] = [];

  constructor(size: number) {
    this.size = size;
    for (let i = 0; i < size; i++) {
      this.workItems.push(new WorkItem(this));
    }
  }
}
