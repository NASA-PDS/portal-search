import fetch from 'cross-fetch'

import { pick } from 'lodash-es'

import {
  Params,
  PdsCmrParams,
  QueryResult
} from '../../types/global'
import {
  formatSearchResults,
  convertPdsDataToAppData,
  convertPdsFacetDataToAppFacetData,
  formatIdentifierNameResults,
  organizeIdsByRefName,
  mapFilterIdsToName,
  mapPageType,
  formatFilterQueries
} from './pds/searchUtils'
import { IdentifierNameDoc } from '../../types/solrSearchResponse'

const validParameters = [
  'bounding_box',
  'data_center_h',
  'granule_data_format_h',
  'horizontal_data_resolution_range',
  'keyword',
  'page_num',
  'page_size',
  'platforms_h',
  'latency',
  'processing_level_id_h',
  'science_keywords_h',
  'sort_key',
  'temporal'
] as const

/**
* Calculates Solr pagination parameters.
 * @param {number} pageNumber - The current page (1-indexed).
 * @param {number} pageSize - Number of results per page.
 * @returns {object} An object containing the 'start' and 'rows' for Solr.
 */
const getSolrPagination = (pageNumber: number, pageSize: number) => {
  // Defensive check: ensure page is at least 1 and treat as integer
  const page = Math.max(1, Math.floor(pageNumber))
  const size = Math.floor(pageSize)

  return {
    start: (page - 1) * size,
    rows: size
  }
}

/**
 * Queries collections with facets in UMM-C format
 * @param {object} queryParams The query params in CMR's format
 * @returns {Promise<Response>} The response from the CMR
 */
export const queryFacetedCollections = async (params: Params): Promise<QueryResult> => {
  // Problem:
  //   1. GraphQL has the fields of UMM but can't use URLs supplied by facets
  //   2. UMM-JSON has the fields of UMM and can use URLs from facets but can't return facets
  //   3. Atom+JSON can use URLs from facets and return facets but doesn't have all the fields of UMM
  //
  // CMR issues filed. Workaround: We need to fire two queries and combine them, one to get facets
  // from Atom+JSON and one to get collection results from UMM-JSON

  const cmrParams = pick(params, validParameters)

  console.log('cmrParams', cmrParams)

  const formattedQuery = formatFilterQueries(params as PdsCmrParams)

  // Keyword logic
  let pdsUrl = 'https://pds.nasa.gov/services/search/search?wt=json&qt=keyword&q='
  if (cmrParams.keyword) {
    pdsUrl += encodeURIComponent(cmrParams.keyword)
  }

  pdsUrl += formattedQuery

  let pageSize = 10
  if (cmrParams.page_size) {
    pageSize = cmrParams.page_size
  }

  let pageNum = 1
  if (cmrParams.page_num) {
    pageNum = cmrParams.page_num
  }

  const pagination = getSolrPagination(pageNum, pageSize)
  pdsUrl += `&start=${pagination.start}&rows=${pagination.rows}`

  if (cmrParams.sort_key && cmrParams.sort_key === 'alpha') {
    pdsUrl += '&sort=title asc'
  }

  console.log('pdsUrl', pdsUrl)

  const pdsRes = await fetch(pdsUrl)
  if (pdsRes.status >= 400) {
    throw new Error('Bad response from server')
  }

  const pdsResponse = await pdsRes.json()
  const formattedData = formatSearchResults(pdsResponse)

  console.log('pdsResponse', pdsResponse)
  console.log('formattedData', formattedData)

  const pdsData = convertPdsDataToAppData(formattedData)

  let facetCountsUrl = 'https://pds.nasa.gov/services/search/search?q=&qt=keyword&rows=0&facet=on&facet.field=investigation_ref&facet.field=instrument_ref&facet.field=target_ref&facet.field=page_type&wt=json&facet.limit=-1'
  if (cmrParams.keyword) {
    facetCountsUrl = facetCountsUrl.replace('q=', `q=${encodeURIComponent(cmrParams.keyword)}`)
  }

  // Facet logic
  const pdsUrls = [
    facetCountsUrl,
    'https://pds.nasa.gov/services/search/search?wt=json&qt=keyword&q=data_class:Investigation&fl=title,identifier&rows=10000',
    'https://pds.nasa.gov/services/search/search?wt=json&qt=keyword&q=data_class:Instrument&fl=title,identifier&rows=10000',
    'https://pds.nasa.gov/services/search/search?wt=json&qt=keyword&q=data_class:Target&fl=title,identifier&rows=10000'
  ]

  const [
    pdsIdsAndCounts,
    pdsInvestigationNames,
    pdsInstrumentNames,
    pdsTargetNames] = await Promise.all([
    fetch(pdsUrls[0]),
    fetch(pdsUrls[1]),
    fetch(pdsUrls[2]),
    fetch(pdsUrls[3])
  ])

  const pdsIdsAndCountsResponse = await pdsIdsAndCounts.clone().json()
  const pdsInvestigationNamesResponse = await pdsInvestigationNames.clone().json()
  const pdsInstrumentNamesResponse = await pdsInstrumentNames.clone().json()
  const pdsTargetNamesResponse = await pdsTargetNames.clone().json()

  console.log('pdsIdsAndCountsResponse', pdsIdsAndCountsResponse)
  console.log('pdsInvestigationNamesResponse', pdsInvestigationNamesResponse)
  console.log('pdsInstrumentNamesResponse', pdsInstrumentNamesResponse)
  console.log('pdsTargetNamesResponse', pdsTargetNamesResponse)

  const formattedIdsAndCountsData = formatIdentifierNameResults(pdsIdsAndCountsResponse)
  const formattedInvestigationData = formatIdentifierNameResults(pdsInvestigationNamesResponse)
  const formattedInstrumentsData = formatIdentifierNameResults(pdsInstrumentNamesResponse)
  const formattedTargetsData = formatIdentifierNameResults(pdsTargetNamesResponse)

  const pageTypeFilterIds: string[] = organizeIdsByRefName(
    formattedIdsAndCountsData,
    'page_type'
  )
  const investigationFilterIds: string[] = organizeIdsByRefName(
    formattedIdsAndCountsData,
    'investigation_ref'
  )
  const instrumentFilterIds: string[] = organizeIdsByRefName(
    formattedIdsAndCountsData,
    'instrument_ref'
  )
  const targetFilterIds: string[] = organizeIdsByRefName(
    formattedIdsAndCountsData,
    'target_ref'
  )

  const investigationNames: IdentifierNameDoc[] = formattedInvestigationData.response.docs
  const instrumentNames: IdentifierNameDoc[] = formattedInstrumentsData.response.docs
  const targetNames: IdentifierNameDoc[] = formattedTargetsData.response.docs

  const investigationFilterOptions = mapFilterIdsToName(
    investigationFilterIds,
    investigationNames
  )
  const instrumentFilterOptions = mapFilterIdsToName(
    instrumentFilterIds,
    instrumentNames
  )
  const targetFilterOptions = mapFilterIdsToName(targetFilterIds, targetNames)
  const pageTypeFilterOptions = mapPageType(pageTypeFilterIds)

  // Provide status / message / headers from the facets query unless collections failed

  const result: QueryResult = {
    status: 200,
    message: '',
    headers: {
      'cmr-hits': pdsData['cmr-hits'] // This is expected a function. Either change the top to not treat as get function or make this have a get by parameter function
    },
    query: 'page_num=1&page_size=10&consortium=EOSDIS&sort_key[]=-score&sort_key[]=-create-data-date'
  }

  const pdsFacetData = convertPdsFacetDataToAppFacetData(
    pageTypeFilterOptions,
    investigationFilterOptions,
    instrumentFilterOptions,
    targetFilterOptions,
    params as PdsCmrParams
  )

  const pdsPromisedFacetData = Promise.resolve<any>(pdsFacetData)
  const pdsPromisedData = Promise.resolve<any>(pdsData)

  try {
    result.data = await pdsPromisedData
    result.facetData = await pdsPromisedFacetData
  } catch (e) {
    console.warn('Unable to parse JSON', e)
  }

  return result
}
