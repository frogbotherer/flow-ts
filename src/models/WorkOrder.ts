import { WorkItem } from './WorkItem';

/** WorkOrders are groups of WorkItems, and contain useful information about how the WorkItems should be treated */
export class WorkOrder {
  workItems: WorkItem[] = [];
  private _startTime;

  constructor(size: number, startTime: number = 0) {
    for (let i = 0; i < size; i++) {
      this.workItems.push(new WorkItem(this));
    }
    this._startTime = startTime;
  }

  // returns true if all the workitems in the order are done
  get done() {
    return this.workItems
      .map((value: WorkItem) => value.done)
      .reduce((previousValue: boolean, currentValue: boolean) => previousValue && currentValue);
  }
}
