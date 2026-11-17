import { formatFacetFields, formatFilterQueries } from '../pds/searchUtils'
import { PdsCmrParams } from '../../../types/global'

const MOON = 'urn:nasa:pds:context:target:satellite.earth.moon'
const MARS = 'urn:nasa:pds:context:target:planet.mars'
const LRO = 'urn:nasa:pds:context:investigation:mission.lunar_reconnaissance_orbiter'

const params = (overrides: Partial<PdsCmrParams>) => overrides as PdsCmrParams

// Splits '&fq=a&fq=b' into its decoded values ['a', 'b']
const decodeParams = (query: string, name: string) => query
  .split('&')
  .filter((part) => part.startsWith(`${name}=`))
  .map((part) => decodeURIComponent(part.slice(name.length + 1)))

describe('formatFilterQueries', () => {
  test('returns an empty string when no filters are selected', () => {
    expect(formatFilterQueries(params({}))).toBe('')
  })

  test('ignores filter groups with no selections', () => {
    expect(formatFilterQueries(params({ targets: [] }))).toBe('')
  })

  test('tags a single selection so its own facet can exclude it', () => {
    expect(decodeParams(formatFilterQueries(params({ targets: [{ topic: MOON }] })), 'fq')).toEqual([
      `{!tag=tar}target_ref:"${MOON}" OR identifier:"${MOON}"`
    ])
  })

  test('ORs multiple values within one group in a single fq', () => {
    const fq = decodeParams(formatFilterQueries(params({
      targets: [{ topic: MOON }, { topic: MARS }]
    })), 'fq')

    expect(fq).toEqual([
      `{!tag=tar}target_ref:"${MOON}" OR identifier:"${MOON}" OR target_ref:"${MARS}" OR identifier:"${MARS}"`
    ])
  })

  test('adds one tagged fq per selected group, so groups are ANDed', () => {
    const fq = decodeParams(formatFilterQueries(params({
      page_types: [{ topic: 'data' }],
      investigations: [{ topic: LRO }],
      instruments: [{ topic: 'urn:nasa:pds:context:instrument:lro.lroc' }],
      targets: [{ topic: MOON }]
    })), 'fq')

    expect(fq.map((value) => value.match(/^\{!tag=(\w+)\}/)?.[1])).toEqual(['ptype', 'inv', 'ins', 'tar'])
    expect(fq[0]).toBe('{!tag=ptype}page_type:"data" OR identifier:"data"')
    expect(fq[1]).toBe(`{!tag=inv}investigation_ref:"${LRO}" OR identifier:"${LRO}"`)
  })

  test('URL-encodes the filter query', () => {
    const query = formatFilterQueries(params({ page_types: [{ topic: 'target portal' }] }))

    expect(query).toBe('&fq=%7B!tag%3Dptype%7Dpage_type%3A%22target%20portal%22%20OR%20identifier%3A%22target%20portal%22')
  })
})

describe('formatFacetFields', () => {
  test('requests every facet field, each excluding its own filter tag', () => {
    expect(decodeParams(formatFacetFields(), 'facet.field')).toEqual([
      '{!ex=ptype}page_type',
      '{!ex=inv}investigation_ref',
      '{!ex=ins}instrument_ref',
      '{!ex=tar}target_ref'
    ])
  })

  test('uses the same tags as formatFilterQueries', () => {
    const allSelected = formatFilterQueries(params({
      page_types: [{ topic: 'data' }],
      investigations: [{ topic: LRO }],
      instruments: [{ topic: 'urn:nasa:pds:context:instrument:lro.lroc' }],
      targets: [{ topic: MOON }]
    }))

    const filterTags = decodeParams(allSelected, 'fq').map((value) => value.match(/^\{!tag=(\w+)\}/)?.[1])
    const excludeTags = decodeParams(formatFacetFields(), 'facet.field').map((value) => value.match(/^\{!ex=(\w+)\}/)?.[1])

    expect(excludeTags).toEqual(filterTags)
  })
})
