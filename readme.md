# `xstream-sample`

```
pnpm install --save xstream-sample
```

An xstream operator to get the latest events from a secondary stream whenever a
primary stream emits.

## description

The result stream will emit the latest events from the "sampled" stream (provided as argument to this operator), only when the source stream emits.

If the source or the sample stream emit an error, the result stream will propagate the error. The result stream will only complete upon completion of the source stream.

Marble diagram:

```text
--1----2-----3---------4---| (source)
----a-----b-----c--d-|       (other)
          sample
-------a-----b---------d---|
```

## usage

```js
import xs from 'xstream'
import sample from 'xstream-sample'

const source = xs.periodic(1000).take(3)
const sampled = xs.periodic(100)

const stream = source.compose(sample(sampled))

stream.addListener({
  next: i => console.log(i),
  error: err => console.error(err),
  complete: () => console.log('completed')
})
```

```text
> 8
> 18
> 28
```

## License

MIT

