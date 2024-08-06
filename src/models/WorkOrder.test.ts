import { WorkItem } from './WorkItem';
import { WorkOrder } from './WorkOrder';

describe('WorkOrder model', () => {
  it('creates <size> WorkItems on construction', () => {
    const wo = new WorkOrder(3);
    expect(wo.workItems.length).to.equal(3);
    expect(wo.workItems[0]).to.be.instanceOf(WorkItem);
  });
  it('starts as undone', () => {
    const wo = new WorkOrder(3);
    expect(wo.done).toBeFalsy();
  });
  it('is marked done once all workitems are done', () => {
    const wo = new WorkOrder(2);
    expect(wo.done).toBeFalsy();
    wo.workItems[0].done = true;
    expect(wo.done).toBeFalsy();
    wo.workItems[1].done = true;
    expect(wo.done).toBeTruthy();
  });
});
