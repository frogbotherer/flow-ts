import { WorkItem } from './WorkItem';
import { WorkOrder } from './WorkOrder';

describe('WorkOrder model', () => {
  it('creates <size> WorkItems on construction', () => {
    const wo = new WorkOrder(3, 'test');
    expect(wo.workItems.length).to.equal(3);
    expect(wo.workItems[0]).to.be.instanceOf(WorkItem);
  });
  it('starts as undone', () => {
    const wo = new WorkOrder(3, 'test');
    expect(wo.done).toBeFalsy();
  });
  it('is marked done once all workitems are done', () => {
    const wo = new WorkOrder(2, 'test');
    expect(wo.done).toBeFalsy();
    wo.workItems[0].setDone(1);
    expect(wo.done).toBeFalsy();
    wo.workItems[1].setDone(2);
    expect(wo.done).toBeTruthy();
  });
  it('records how long it took to complete all workitems', () => {
    const wo = new WorkOrder(2, 'test');
    wo.workItems[0].setDone(1);
    expect(wo.duration).toEqual(1);
    wo.workItems[1].setDone(3);
    expect(wo.duration).toEqual(3);
  });
});
