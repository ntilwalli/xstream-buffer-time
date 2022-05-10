/// <reference types="mocha"/>
/// <reference types="node" />
import xs, {Stream} from 'xstream';
import bufferTime from './index';
import * as assert from 'assert';

describe('sample', () => {
  it('should buffer values over time interval', (done: any) => {
    //Create an observable that emits a value every 50ms
    const source = xs.periodic(50).take(4);
    //After 200 milliseconds have passed, emit buffered values as an array
    const example = source
      .compose(bufferTime(200));
    //Print values to console
    //ex. output [0,1,2]...[3,4,5,6]
    const subscribe = example.addListener({
      next: val => {
        assert.equal(Array.isArray(val), true)
        assert.equal(val[0], 0)
        assert.equal(val[2], 2)
        done()
      },
      error: () => {},
      complete: () => {},
    });
  });
});
