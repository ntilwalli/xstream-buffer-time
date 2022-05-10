import {Operator, Stream} from 'xstream';

class BufferTimeOperator<T> implements Operator<T, T[]> {
  public type = 'bufferTime';
  public out: Stream<T[]> = null as any;
  private buffer: T[]
  private intervalId: any | undefined

  constructor(public interval: number, public ins: Stream<T>) {
    this.buffer = []
    this.intervalId = undefined
  }

  public _start(out: Stream<T[]>): void {
    this.out = out;
    this.intervalId = setInterval(() => {
      this.out._n(this.buffer)
      this.buffer = []
    }, this.interval)
    this.ins._add(this);
  }

  public _stop(): void {
    this.intervalId = clearInterval(this.intervalId)
    this.ins._remove(this);
    this.out = null as any;
  }

  public _n(t: T) {
    this.buffer.push(t)
  }

  public _e(err: any) {
    this.out._e(err);
  }

  public _c() {
    this.out._c();
  }
}

/**
 * Emits buffered values over a set time-interval
 *
 * Example:
 *
 * ```js
 * import xs from 'xstream'
 * import fromDiagram from 'xstream/extra/fromDiagram'
 * import bufferTime from './index'
 *
 * let is_complete = false
 * const stream = xs.periodic(50).take(8)
 *  .compose(bufferTime(200))
 *
 * stream.addListener({
 *   next: i => console.log(i),
 *   error: err => console.error(err),
 *   complete: () => console.log('completed')
 * })
 * ```
 *
 * ```text
 * > starting
 * > [0, 1, 2]  (after 200 ms)
 * > [3, 4, 5, 6]  (after 400 ms)
 * > completed
 * ```
 *
 * @param {number} interval The interval over which to buffer values;
 * @return {Stream}
 */
export default function bufferTime<T>(
  interval: number
): (ins: Stream<T>) => Stream<T[]> {
  return function bufferTimeOperator(ins: Stream<T>): Stream<T[]> {
    return new Stream<T[]>(new BufferTimeOperator(interval, ins));
  };
}
