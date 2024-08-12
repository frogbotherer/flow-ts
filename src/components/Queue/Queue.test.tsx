import { render, screen } from '@test-utils';
import { vi } from 'vitest';
import { Queue, QueueState } from './Queue';
import { Receiver } from '@/models/Receiver';
import { WorkOrder } from '@/models/WorkOrder';

class DummyReceiver implements Receiver {
  name: string = 'dummy';
  sender: string | null = null;
  blocked: boolean = false;
  receive = vi.fn();
}

describe('Queue component', () => {
  it('displays its name', () => {
    render(<Queue name="test" />);
    expect(screen.getByText('Queue: test')).toBeVisible();
  });

  it('has a name and capacity', () => {
    const qs = new QueueState('test', 2);
    expect(qs.name).toEqual('test');
    expect(qs.capacity).toEqual(2);
  });

  it('adds received workitems to its list', () => {
    const qs = new QueueState('test', 2);
    const wo = new WorkOrder(1, 'test');
    qs.receive(wo.workItems[0], 1);
    expect(qs.workItems.length).toEqual(1);
    expect(qs.workItems[0]).toBe(wo.workItems[0]);
  });
  it('burns down workitem effort', () => {
    const qs = new QueueState('test', 2);
    const wo = new WorkOrder(1, 'test');
    const dr = new DummyReceiver();
    qs.receive(wo.workItems[0], 1);
    wo.workItems[0].setEffort('test', 20, 1); // override whatever the default distribution did
    qs.send(dr, 2);
    expect(dr.receive).not.toHaveBeenCalled();
    expect(wo.workItems[0].effortRemaining).toEqual(4); // 20 - 2*8
  });
  it('does not crash when it is empty', () => {
    const qs = new QueueState('test', 2);
    const dr = new DummyReceiver();
    qs.send(dr, 1);
    expect(dr.receive).not.toHaveBeenCalled();
  });
  it('sends workitems when the effort burns to zero', () => {
    const qs = new QueueState('test', 2);
    const wo = new WorkOrder(1, 'test');
    const dr = new DummyReceiver();
    qs.receive(wo.workItems[0], 1);
    wo.workItems[0].setEffort('test', 10, 1); // override whatever the default distribution did
    qs.send(dr, 2);
    expect(dr.receive).toHaveBeenCalledOnce();
    expect(qs.workItems.length).toEqual(0);
    expect(wo.workItems[0].effortRemaining).toEqual(0);
  });
  it('sends multiple workitems when the capacity allows', () => {
    const qs = new QueueState('test', 4);
    const wo = new WorkOrder(2, 'test');
    const dr = new DummyReceiver();
    qs.receive(wo.workItems[0], 1);
    qs.receive(wo.workItems[1], 2);
    wo.workItems[0].setEffort('test', 10, 1); // override whatever the default distribution did
    wo.workItems[1].setEffort('test', 10, 2); // override whatever the default distribution did
    qs.send(dr, 2);
    expect(dr.receive).toHaveBeenCalledTimes(2);
    expect(qs.workItems.length).toEqual(0);
    expect(wo.workItems[0].effortRemaining).toEqual(0);
    expect(wo.workItems[1].effortRemaining).toEqual(0);
  });
  it('becomes blocked if wip limit is set and backlog is full', () => {
    const qs = new QueueState('test', 1, 2);
    const wo = new WorkOrder(3, 'test');
    expect(qs.wipLimit).toEqual(2);
    qs.receive(wo.workItems[0], 1);
    expect(qs.blocked).toBeFalsy();

    qs.receive(wo.workItems[1], 2);
    expect(qs.blocked).toBeTruthy();

    expect(() => {
      qs.receive(wo.workItems[2], 3);
    }).toThrowError();
  });
  it('becomes unblocked if wip limit is set and backlog is worked', () => {
    const qs = new QueueState('test', 100, 2);
    const wo = new WorkOrder(3, 'test');
    const dr = new DummyReceiver();
    expect(qs.wipLimit).toEqual(2);
    qs.receive(wo.workItems[0], 1);
    qs.receive(wo.workItems[1], 2);
    expect(qs.blocked).toBeTruthy();

    qs.send(dr, 3);
    expect(qs.blocked).toBeFalsy();
  });
});
