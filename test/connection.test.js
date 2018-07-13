import test from 'ava'

test.cb('success without failure', require('./connection/success-without-failure'))
test.cb('success after serveral consecutive failures', require('./connection/success-after-failures'))
test.cb('continuous failure without success', require('./connection/failure-without-success'))
test.cb('error after connection established', require('./connection/error-after-success'))