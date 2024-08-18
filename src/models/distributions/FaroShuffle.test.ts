import { WorkOrder } from '../WorkOrder';
import { FaroShuffle } from './FaroShuffle';

describe('FaroShuffle', () => {
  it('shuffles AAABBB into ABABAB', () => {
    const f = new FaroShuffle();
    const a = new WorkOrder(3, 'a');
    const b = new WorkOrder(3, 'b');
    const items = [
      a.workItems[0],
      a.workItems[1],
      a.workItems[2],
      b.workItems[0],
      b.workItems[1],
      b.workItems[2],
    ];
    f.shuffle(items);
    expect(items.length).toEqual(6);
    expect(items[0]).toBe(a.workItems[0]);
    expect(items[1]).toBe(b.workItems[0]);
    expect(items[2]).toBe(a.workItems[1]);
    expect(items[3]).toBe(b.workItems[1]);
    expect(items[4]).toBe(a.workItems[2]);
    expect(items[5]).toBe(b.workItems[2]);
  });
  it('shuffles AABBCC into ABCABC', () => {
    const f = new FaroShuffle();
    const a = new WorkOrder(2, 'a');
    const b = new WorkOrder(2, 'b');
    const c = new WorkOrder(2, 'c');
    const items = [
      a.workItems[0],
      a.workItems[1],
      b.workItems[0],
      b.workItems[1],
      c.workItems[0],
      c.workItems[1],
    ];
    f.shuffle(items);
    expect(items.length).toEqual(6);
    expect(items[0]).toBe(a.workItems[0]);
    expect(items[1]).toBe(b.workItems[0]);
    expect(items[2]).toBe(c.workItems[0]);
    expect(items[3]).toBe(a.workItems[1]);
    expect(items[4]).toBe(b.workItems[1]);
    expect(items[5]).toBe(c.workItems[1]);
  });
  it('shuffles AAAABB into ABABAA', () => {
    const f = new FaroShuffle();
    const a = new WorkOrder(4, 'a');
    const b = new WorkOrder(2, 'b');
    const items = [
      a.workItems[0],
      a.workItems[1],
      a.workItems[2],
      a.workItems[3],
      b.workItems[0],
      b.workItems[1],
    ];
    f.shuffle(items);
    expect(items.length).toEqual(6);
    expect(items[0]).toBe(b.workItems[0]);
    expect(items[1]).toBe(a.workItems[0]);
    expect(items[2]).toBe(b.workItems[1]);
    expect(items[3]).toBe(a.workItems[1]);
    expect(items[4]).toBe(a.workItems[2]);
    expect(items[5]).toBe(a.workItems[3]);
  });
  it('shuffles AAAABBC into ABCABAA', () => {
    const f = new FaroShuffle();
    const a = new WorkOrder(4, 'a');
    const b = new WorkOrder(2, 'b');
    const c = new WorkOrder(1, 'c');

    const items = [
      a.workItems[0],
      a.workItems[1],
      a.workItems[2],
      a.workItems[3],
      b.workItems[0],
      b.workItems[1],
      c.workItems[0],
    ];
    f.shuffle(items);
    expect(items.length).toEqual(7);
    expect(items[0]).toBe(c.workItems[0]);
    expect(items[1]).toBe(b.workItems[0]);
    expect(items[2]).toBe(a.workItems[0]);
    expect(items[3]).toBe(b.workItems[1]);
    expect(items[4]).toBe(a.workItems[1]);
    expect(items[5]).toBe(a.workItems[2]);
    expect(items[6]).toBe(a.workItems[3]);
  });
  it('shuffles AAA into AAA (NB. order unimportant)', () => {
    const f = new FaroShuffle();
    const a = new WorkOrder(3, 'a');
    const items = [a.workItems[0], a.workItems[1], a.workItems[2]];
    f.shuffle(items);
    expect(items.length).toEqual(3);
    expect(items[0]).toBe(a.workItems[0]);
    expect(items[1]).toBe(a.workItems[1]);
    expect(items[2]).toBe(a.workItems[2]);
  });
});
