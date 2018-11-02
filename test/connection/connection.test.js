const test = require('ava').default

test.cb('success without failure', require('./success-without-failure'))
test.cb('success after serveral consecutive failures', require('./success-after-failures'))
test.cb('continuous failure without success', require('./failure-without-success'))
test.cb('error after connection established', require('./error-after-success'))
test.cb('manually reconnect after a connection success', require('./manual-reconnect-after-success'))
test.cb('manually reconnect after a normal connection closure', require('./manual-reconnect-after-closed'))
test.cb('multiple calls to #connect() are ignored before the first connection success', require('./multiple-connect-calls-before-success'))
test.cb('multiple calls to #disconnect() are ignored before the first disconnection', require('./multiple-disconnect-calls-before-disconnected'))
test.cb('multiple calls to #reconnect() are ignored before the first reconnection success', require('./multiple-reconnect-calls-before-reconnected'))
