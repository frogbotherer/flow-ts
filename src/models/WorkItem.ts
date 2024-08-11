import type { WorkOrder } from './WorkOrder';
/** capture work done at multiple stages in a flow */
type WorkLog = {
  effortRequired: number;
  effortExpended: number;
  timeStarted: number;
  timeCompleted: number;
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
  // when the item was started and completed
  private _timeStarted: number = 0;
  private _timeCompleted: number = 0;

  constructor(workOrder: WorkOrder, timeStarted: number) {
    this.workOrder = workOrder;
    this._timeStarted = timeStarted;
  }

  setEffort(stage: string, effort: number, time: number) {
    if (this._done) {
      throw Error("Attempting to define effort for a WorkItem that's done");
    }
    // TODO deal with ?accidental? overwrites
    this._log[stage] = {
      effortRequired: effort,
      effortExpended: 0,
      timeStarted: time,
      timeCompleted: 0,
    };
    this._currentStage = stage;
  }

  // log some work done; return how much was done
  doEffort(effort: number, time: number): number {
    if (this._done) {
      throw Error("Attempting to work on a WorkItem that's done");
    }
    const stage = this._currentStage;
    if (!(stage in this._log)) {
      throw Error(`Attempting to work on a WorkItem in ${stage} without calling setWork()`);
    }
    const log = this._log[stage];

    if (log.effortRequired - log.effortExpended < effort) {
      const e = log.effortRequired - log.effortExpended;
      log.effortExpended = log.effortRequired;
      // NB, we don't set _done since it might not be _done done_
      log.timeCompleted = time;
      return e;
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
  setDone(time: number) {
    // TODO should we stop done=false? should we allow done=true if effortRemaining>0?
    if (this.effortRemaining > 0) {
      throw Error('Attempting to set WorkItem to done when effort remaining');
    }
    this._done = true;
    this._timeCompleted = time;
  }
  get timeCompleted() {
    return this._timeCompleted;
  }
}
