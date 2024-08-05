import type { WorkOrder } from './WorkOrder';
/** capture work done at multiple stages in a flow */
type WorkLog = {
  effortRequired: number;
  effortExpended: number;
};
/** WorkItems represent individual pieces of work in the system */
export class WorkItem {
  workOrder: WorkOrder;
  private _log: Record<string, WorkLog> = {};
  private _currentStage: string = '(not set yet)';

  constructor(workOrder: WorkOrder) {
    this.workOrder = workOrder;
  }

  setEffort(stage: string, effort: number) {
    // TODO deal with ?accidental? overwrites
    this._log[stage] = { effortRequired: effort, effortExpended: 0 };
    this._currentStage = stage;
  }

  // log some work done; return how much was done
  doEffort(effort: number): number {
    const stage = this._currentStage;
    if (!(stage in this._log)) {
      throw Error(`Attempting to work on a WorkItem in ${stage} without calling setWork()`);
    }
    const log = this._log[stage];

    if (log.effortRequired - log.effortExpended < effort) {
      const e = effort - (log.effortRequired - log.effortExpended);
      log.effortExpended = log.effortRequired;
      return e;
    }
    log.effortExpended += effort;
    return effort;
  }

  get effortRequired() {
    return this._log[this._currentStage].effortRequired;
  }
  get effortExpended() {
    return this._log[this._currentStage].effortExpended;
  }
  get effortRemaining() {
    return this.effortRequired - this.effortExpended;
  }
}
