import type { WorkOrder } from './WorkOrder';
/** capture work done at multiple stages in a flow */
type WorkLog = {
  effortRequired: number;
  effortExpended: number;
};
/** WorkItems represent individual pieces of work in the system */
export class WorkItem {
  workOrder: WorkOrder;
  // log of all work done on item
  private _log: Record<string, WorkLog> = {};
  // current part of flow where item is
  private _currentStage: string = '(not set yet)';
  // whether workitem is completely finished or not
  private _done: boolean = false;

  constructor(workOrder: WorkOrder) {
    this.workOrder = workOrder;
  }

  setEffort(stage: string, effort: number) {
    if (this._done) {
      throw Error("Attempting to define effort for a WorkItem that's done");
    }
    // TODO deal with ?accidental? overwrites
    this._log[stage] = { effortRequired: effort, effortExpended: 0 };
    this._currentStage = stage;
  }

  // log some work done; return how much was done
  doEffort(effort: number): number {
    if (this._done) {
      throw Error("Attempting to work on a WorkItem that's done");
    }
    const stage = this._currentStage;
    if (!(stage in this._log)) {
      throw Error(`Attempting to work on a WorkItem in ${stage} without calling setWork()`);
    }
    const log = this._log[stage];

    if (log.effortRequired - log.effortExpended < effort) {
      const e = effort - (log.effortRequired - log.effortExpended);
      log.effortExpended = log.effortRequired;
      return e;
      // NB, we don't set _done since it might not be _done done_
    }
    log.effortExpended += effort;
    return effort;
  }

  get effortRequired() {
    if (!(this._currentStage in this._log)) {
      return 0;
    }
    return this._log[this._currentStage].effortRequired;
  }
  get effortExpended() {
    if (!(this._currentStage in this._log)) {
      return 0;
    }
    return this._log[this._currentStage].effortExpended;
  }
  get effortRemaining() {
    return this.effortRequired - this.effortExpended;
  }
  get done() {
    return this._done;
  }
  set done(done: boolean) {
    // TODO should we stop done=false? should we allow done=true if effortRemaining>0?
    if (this._done && !done) {
      throw Error('Attempting to set WorkItem.done to false');
    }
    if (this.effortRemaining > 0 && done) {
      throw Error('Attempting to set WorkItem to done when effort remaining');
    }
    this._done = done;
  }
}
