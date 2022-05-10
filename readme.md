# `xstream-upon-start`

```
pnpm install --save xstream-buffer-time
```

Emits buffered values over a set time-interval

## usage

```js
import xs from 'xstream'
import fromDiagram from 'xstream/extra/fromDiagram'
import bufferTime from 'xstream-buffer-time'
 
const stream = xs.periodic(500).take(8)
  .compose(bufferTime(200))
 
stream.addListener({
  next: i => console.log(i),
  error: err => console.error(err),
  complete: () => console.log('completed')
})
```

```text
> starting
> [0, 1, 2]  (after 200 ms)
> [3, 4, 5, 6]  (after 406 ms)
> completed
```

## License

MIT


