/**
 * Boost applied to the prefix-wildcard form of the query. Wildcard terms get a
 * constant score in Solr, so they are kept as a low-weight fallback: exact
 * word matches decide the ranking, and prefixes only widen the result set.
 */
export const PREFIX_WILDCARD_BOOST = 0.1

// Characters and operators that mean the user wrote their own Solr query syntax
const SOLR_SYNTAX_CHARS = /[*?:"()[\]{}^~\\/!]/
const SOLR_PREFIX_OPERATOR = /(^|\s)[+-]/
const SOLR_BOOLEAN_OPERATOR = /(^|\s)(AND|OR|NOT|&&|\|\|)(\s|$)/

/**
 * Builds the Solr keyword query from the text typed in the search box.
 *
 * Plain words are sent as the exact words, OR'd with a low-boost prefix-wildcard form:
 *   'data bopps' -> '(data bopps) OR (data* bopps*)^0.1'
 *
 * This keeps results the same regardless of word order (a trailing wildcard on
 * only some words strips those words of their relevance weight) while still
 * matching partial words such as 'hayabus' -> Hayabusa.
 *
 * Input that already uses Solr syntax (quoted phrases, wildcards, field
 * queries, boolean operators, grouping, boosts) is passed through unchanged.
 *
 * @param keyword - The keyword string typed by the user.
 * @returns The Solr query string, or undefined if the input is empty.
 *
 * @example
 * getKeywordWithWildcard('apple') // '(apple) OR (apple*)^0.1'
 * getKeywordWithWildcard('red apple') // '(red apple) OR (red* apple*)^0.1'
 * getKeywordWithWildcard('"exact phrase"') // '"exact phrase"'
 * getKeywordWithWildcard('appl*') // 'appl*'
 * getKeywordWithWildcard('') // undefined
 */
export const getKeywordWithWildcard = (keyword?: string | null): string | undefined => {
  const trimmed = keyword?.trim()
  if (!trimmed) return undefined

  if (
    SOLR_SYNTAX_CHARS.test(trimmed)
    || SOLR_PREFIX_OPERATOR.test(trimmed)
    || SOLR_BOOLEAN_OPERATOR.test(trimmed)
  ) {
    return trimmed
  }

  const words = trimmed.split(/\s+/)
  const exact = words.join(' ')
  const prefixes = words.map((word) => `${word}*`).join(' ')

  return `(${exact}) OR (${prefixes})^${PREFIX_WILDCARD_BOOST}`
}
