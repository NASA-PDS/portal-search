import { getKeywordWithWildcard } from '../getKeywordWithWildcard'

describe('getKeywordWithWildcard', () => {
  test('should combine the exact word with a low-boost prefix wildcard for a single word', () => {
    expect(getKeywordWithWildcard('apple')).toBe('(apple) OR (apple*)^0.1')
  })

  test('should combine exact words with low-boost prefix wildcards for multiple words', () => {
    expect(getKeywordWithWildcard('red apple')).toBe('(red apple) OR (red* apple*)^0.1')
  })

  test('should put a wildcard on every word, not only the last (word order must not matter)', () => {
    expect(getKeywordWithWildcard('data bopps')).toBe('(data bopps) OR (data* bopps*)^0.1')
    expect(getKeywordWithWildcard('bopps data')).toBe('(bopps data) OR (bopps* data*)^0.1')
  })

  test('should collapse multiple spaces and trim surrounding whitespace', () => {
    expect(getKeywordWithWildcard('  red  apple   pie ')).toBe('(red apple pie) OR (red* apple* pie*)^0.1')
  })

  test('should return exact phrase when enclosed in double quotes', () => {
    expect(getKeywordWithWildcard('"exact phrase"')).toBe('"exact phrase"')
  })

  test.each([
    ['appl*'],
    ['te?t'],
    ['title:mars'],
    ['mars AND rover'],
    ['mars OR rover'],
    ['NOT mars'],
    ['+mars -rover'],
    ['(mars rover)'],
    ['mars^2 rover'],
    ['marz~']
  ])('should pass through user-written Solr syntax unchanged: %s', (keyword) => {
    expect(getKeywordWithWildcard(keyword)).toBe(keyword)
  })

  test('should not treat lowercase "and"/"or" as operators', () => {
    expect(getKeywordWithWildcard('rock and roll')).toBe('(rock and roll) OR (rock* and* roll*)^0.1')
  })

  test('should not treat a hyphen inside a word as an operator', () => {
    expect(getKeywordWithWildcard('mars-2020')).toBe('(mars-2020) OR (mars-2020*)^0.1')
  })

  test('should return undefined for empty string input', () => {
    expect(getKeywordWithWildcard('')).toBeUndefined()
  })

  test('should return undefined for whitespace-only input', () => {
    expect(getKeywordWithWildcard('   ')).toBeUndefined()
  })

  test('should return undefined for undefined input', () => {
    expect(getKeywordWithWildcard(undefined)).toBeUndefined()
  })

  test('should return undefined for null input', () => {
    expect(getKeywordWithWildcard(null)).toBeUndefined()
  })
})
