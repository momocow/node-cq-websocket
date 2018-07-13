# TODO

## Connection Behavior
- [ ] success without failure
- [ ] success after serveral consecutive failures
- [ ] continuous failure without success
- [ ] error after connection established

## Connection State
Read more at [#5](https://github.com/momocow/node-cq-websocket/issues/5)

`connect()`
- [ ] effective if and only if it's in the `init` or `closed` state

`disconnect()`
- [ ] effective if and only if it's in the `connected` state

`reconnect()`
- [ ] effective if and only if it's in the `init`, `connected` or `closed` state

Others
- [ ] no connection would establish if it's in the `disabled` state
- [ ] no connection-related actions would be taken in an unstable state like `connecting` or `closing`
