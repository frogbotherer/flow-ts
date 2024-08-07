import { WorkItem } from './WorkItem';

/** WorkOrders are groups of WorkItems, and contain useful information about how the WorkItems should be treated */
export class WorkOrder {
  workItems: WorkItem[] = [];
  private _timeStarted: number;
  private _name: string;

  constructor(size: number, name: string, startTime: number = 0) {
    for (let i = 0; i < size; i++) {
      this.workItems.push(new WorkItem(this, startTime));
    }
    this._name = name;
    this._timeStarted = startTime;
  }

  get name() {
    return this._name;
  }

  // returns true if all the workitems in the order are done
  get done() {
    return this.workItems
      .map((value: WorkItem) => value.done)
      .reduce((previousValue: boolean, currentValue: boolean) => previousValue && currentValue);
  }

  get duration() {
    return this.workItems.map((wi: WorkItem) => wi.duration).reduce((p, c) => (p > c ? p : c));
  }
}
