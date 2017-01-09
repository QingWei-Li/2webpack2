import test from 'ava'
import cleanDevServer from '../dev-server'

test('clean', t => {
  const actual = cleanDevServer({
    haha: true,
    log: true,
    host: '0.0.0.0',
    port: 8000
  })
  const fixture = {
    log: true,
    host: '0.0.0.0',
    port: 8000
  }

  t.deepEqual(actual, fixture)
})
