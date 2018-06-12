/// <reference types="mocha"/>
/// <reference types="node" />
import xs, {Stream} from 'xstream';
import sample from './index';
import * as assert from 'assert';

describe('sample', () => {
  it('should sample a second stream', (done: any) => {
    const stream1 = xs
      .periodic(100)
      .take(3)
      .startWith(-1);
    const stream2 = xs
      .periodic(99)
      .take(3)
      .map(i => ['a', 'b', 'c'][i]);
    const stream = stream1.compose(sample(stream2));
    let expected = ['a', 'b', 'c'];
    stream.addListener({
      next: (x: string) => {
        const e = expected.shift();
        if (e) {
          assert.equal(x[0], e[0]);
          assert.equal(x[1], e[1]);
        } else {
          assert.fail(undefined, e, 'e should be defined', '=');
        }
      },
      error: done,
      complete: () => {
        assert.equal(expected.length, 0);
        done();
      },
    });
  });

  it('should have correct TypeScript signature', (done: any) => {
    const stream1 = xs.create<number>({
      start: listener => {},
      stop: () => {},
    });

    const stream2 = xs.create<string>({
      start: listener => {},
      stop: () => {},
    });

    const combined: Stream<string> = stream1.compose(sample(stream2));
    done();
  });

  it('should complete only when the source stream has completed', (done: any) => {
    const stream1 = xs.periodic(100).take(4);
    const stream2 = xs.periodic(99).take(1);
    const stream = stream1.compose(sample(stream2));
    let expected = [0, 0, 0, 0];
    stream.addListener({
      next: x => {
        assert.equal(x, expected.shift());
      },
      error: done,
      complete: () => {
        assert.equal(expected.length, 0);
        done();
      },
    });
  });

  it('should not pick values from the sampled stream before it has emitted', (done: any) => {
    const stream1 = xs.periodic(100).take(4);
    const stream2 = xs.periodic(150).take(1);
    const stream = stream1.compose(sample(stream2));
    let expected = [0, 0, 0];
    stream.addListener({
      next: x => {
        assert.equal(x, expected.shift());
      },
      error: done,
      complete: () => {
        assert.equal(expected.length, 0);
        done();
      },
    });
  });

  it('should return a Stream when sampling a Stream with a MemoryStream', (done: any) => {
    const input1 = xs
      .periodic(80)
      .take(4)
      .remember();
    const input2 = xs.periodic(50).take(3);
    const stream: Stream<number> = input1.compose(sample(input2));
    assert.strictEqual(stream instanceof Stream, true);
    done();
  });

  it('should return a Stream when sampling a MemoryStream with a MemoryStream', (done: any) => {
    const input1 = xs
      .periodic(80)
      .take(4)
      .remember();
    const input2 = xs
      .periodic(50)
      .take(3)
      .remember();
    const stream: Stream<number> = input1.compose(sample(input2));
    assert.strictEqual(stream instanceof Stream, true);
    done();
  });
});
