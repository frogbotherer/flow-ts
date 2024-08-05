import { WorkItem } from './WorkItem';
import { WorkOrder } from './WorkOrder';

describe('WorkOrder model', () => {
  it('creates <size> WorkItems on construction', () => {
    const wo = new WorkOrder(3);
    expect(wo.workItems.length).to.equal(3);
    expect(wo.workItems[0]).to.be.instanceOf(WorkItem);
  });
});
