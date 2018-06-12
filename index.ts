import {InternalListener, Operator, Stream, NO} from 'xstream';

export class SampleListener<T> implements InternalListener<T> {
  constructor(private p: SampleOperator<any>) {
    p.il = this;
  }

  _n(t: T): void {
    this.p.up(t);
  }

  _e(err: any): void {
    this.p._e(err);
  }

  _c(): void {
    this.p.down();
  }
}

export class SampleOperator<T> implements Operator<any, T> {
  public type = 'sample';
  public ins: Stream<any>;
  public sampled: Stream<T>;
  public out: Stream<T>;
  public il?: SampleListener<T>;
  public val: T | typeof NO;

  constructor(ins: Stream<any>, sampled: Stream<T>) {
    this.ins = ins;
    this.sampled = sampled;
    this.out = NO as Stream<T>;
    this.il = undefined;
    this.val = NO;
  }

  _start(out: Stream<T>): void {
    this.out = out;
    const s = this.sampled;
    s._add(new SampleListener<T>(this));
    this.ins._add(this);
  }

  _stop(): void {
    this.ins._remove(this);
    if (this.il) this.sampled._remove(this.il);
    this.out = NO as Stream<T>;
    this.val = NO;
    this.il = undefined;
  }

  _n(t: any): void {
    const out = this.out;
    if (out === NO) return;
    const val = this.val;
    if (val === NO) return;
    out._n(val as T);
  }

  _e(err: any): void {
    const out = this.out;
    if (out === NO) return;
    out._e(err);
  }

  _c(): void {
    const out = this.out;
    if (out === NO) return;
    out._c();
  }

  up(t: any): void {
    if (this.out === NO) return;
    this.val = t;
  }

  down(): void {
    if (this.il) this.sampled._remove(this.il);
  }
}

/**
 * The result stream will emit the latest events from the "sampled" stream
 * (provided as argument to this operator), only when the source stream emits.
 *
 * @param {Stream} sampled The stream to be sampled by the source stream
 * @return {Stream}
 */
export default function sample<T>(sampled: Stream<T>) {
  return function sampleOperator(source: Stream<any>): Stream<T> {
    return new Stream<T>(new SampleOperator<T>(source, sampled));
  };
}
