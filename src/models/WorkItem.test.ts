import { WorkItem } from './WorkItem';
import { WorkOrder } from './WorkOrder';

describe('WorkItem model', () => {
  it('can be constructed', () => {
    const wo = new WorkOrder(0, 't', 0);
    const wi = new WorkItem(wo, 0);
    expect(wi).to.be.an.instanceOf(WorkItem);
  });

  it('can be initialised with effort to expend', () => {
    const wo = new WorkOrder(0, 't', 0);
    const wi = new WorkItem(wo, 0);
    wi.setEffort('test', 5, 0);
    expect(wi.effortExpended).toEqual(0);
    expect(wi.effortRemaining).toEqual(5);
    expect(wi.effortRequired).toEqual(5);
  });

  it('can log effort', () => {
    const wo = new WorkOrder(0, 't', 0);
    const wi = new WorkItem(wo, 0);
    wi.setEffort('test', 5, 0);
    const effort = wi.doEffort(3, 0);
    expect(effort).toEqual(3);
    expect(wi.effortExpended).toEqual(3);
    expect(wi.effortRemaining).toEqual(2);
    expect(wi.effortRequired).toEqual(5);
  });
  it('can log effort several times', () => {
    const wo = new WorkOrder(0, 't', 0);
    const wi = new WorkItem(wo, 0);
    wi.setEffort('test', 10, 0);

    const e1 = wi.doEffort(5, 0);
    expect(wi.effortExpended).toEqual(5);
    expect(wi.effortRemaining).toEqual(5);

    const e2 = wi.doEffort(3, 1);
    expect(wi.effortExpended).toEqual(8);
    expect(wi.effortRemaining).toEqual(2);

    const e3 = wi.doEffort(4, 2);
    expect(wi.effortExpended).toEqual(10);
    expect(wi.effortRemaining).toEqual(0);

    expect(e1).toEqual(5);
    expect(e2).toEqual(3);
    expect(e3).toEqual(2);
  });
  it('will report overwork', () => {
    const wo = new WorkOrder(0, 't', 0);
    const wi = new WorkItem(wo, 0);
    wi.setEffort('test', 5, 0);
    const effort = wi.doEffort(8, 1);
    expect(effort).toEqual(3);
    expect(wi.effortExpended).toEqual(5);
    expect(wi.effortRemaining).toEqual(0);
    expect(wi.effortRequired).toEqual(5);
  });
  it('can log effort independently in separate stages', () => {
    const wo = new WorkOrder(0, 't', 0);
    const wi = new WorkItem(wo, 0);
    wi.setEffort('test', 5, 0);
    const testEffort = wi.doEffort(2, 1);

    expect(wi.effortExpended).toEqual(2);
    expect(wi.effortRemaining).toEqual(3);
    expect(wi.effortRequired).toEqual(5);

    wi.setEffort('design', 10, 1);
    const designEffort = wi.doEffort(4, 1);

    expect(testEffort).toEqual(2);
    expect(designEffort).toEqual(4);
    expect(wi.effortExpended).toEqual(4);
    expect(wi.effortRemaining).toEqual(6);
    expect(wi.effortRequired).toEqual(10);
  });
  it('forbids work on an item flagged as done', () => {
    const wo = new WorkOrder(0, 'test');
    const wi = new WorkItem(wo, 0);
    wi.setEffort('test', 5, 0);
    wi.doEffort(5, 0);
    wi.setDone(1);

    expect(() => {
      wi.doEffort(5, 1);
    }).toThrowError();
    expect(() => {
      wi.setEffort('run', 5, 1);
    }).toThrowError();
  });
});
