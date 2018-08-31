const { prettyDate, extractReposAndOwners } = require('../lib/requests')

test('prettyDate() makes a date look more readable.', () => {
  expect(prettyDate('2018-05-22T05:58:14Z')).toBe('May 21st 2018, 10:58:14 PM')
})

