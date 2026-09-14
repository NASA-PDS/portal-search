import {
  IdentifierNameDoc,
  IdentifierNameResponse,
  Response,
  SolrSearchResponse,
  SolrIdentifierNameResponse,
  SearchResultDoc
} from '../../../types/solrSearchResponse'

import {
  SolrSearchResponse as SolrSearchResponseExpected,
  SolrIdentifierNameResponse as SolrIdentifierNameResponseExpected,
  IdentifierNameResponse as IdentifierNameResponseExpected,
  IdentifierNameDoc as IdentifierNameDocExpected,
  Response as ResponseExpected,
  SearchResultDoc as SearchResultDocExpected
} from '../../../types/solrSearchResponseExpected'

import { PdsCmrParams } from '../../../types/global'

const convertToStringArray = (
  param: string | string[]
): string[] => (Array.isArray(param) ? param : [param])

const transformDocs = (data: SearchResultDocExpected[]) => {
  const formattedData: SearchResultDoc[] = []

  data.forEach((docExpected) => {
    const doc: SearchResultDoc = {
      page_type: convertToStringArray(docExpected.page_type),
      file_ref_location: convertToStringArray(docExpected.file_ref_location),
      data_class: convertToStringArray(docExpected.data_class),
      description: convertToStringArray(docExpected.description),
      file_ref_url: convertToStringArray(docExpected.file_ref_url),
      title: convertToStringArray(docExpected.title),
      resLocation: convertToStringArray(docExpected.resLocation),
      objectType: convertToStringArray(docExpected.objectType),
      product_class: convertToStringArray(docExpected.product_class),
      data_product_type: convertToStringArray(docExpected.data_product_type),
      file_ref_size: convertToStringArray(docExpected.file_ref_size),
      modification_date: convertToStringArray(docExpected.modification_date),
      file_ref_name: convertToStringArray(docExpected.file_ref_name),
      identifier: convertToStringArray(docExpected.identifier),
      resource_url: convertToStringArray(docExpected.resource_url),
      agency_name: convertToStringArray(docExpected.agency_name),
      'form-agency': convertToStringArray(docExpected['form-agency']),
      modification_description: convertToStringArray(docExpected.modification_description),
      resource_type: convertToStringArray(docExpected.resource_type),
      search_id: convertToStringArray(docExpected.search_id),
      pds_model_version: convertToStringArray(docExpected.pds_model_version),
      resource_description: convertToStringArray(docExpected.resource_description),
      resource_name: convertToStringArray(docExpected.resource_name),
      timestamp: convertToStringArray(docExpected.timestamp),
      score: docExpected.score,
      investigation_type: convertToStringArray(docExpected.investigation_type),
      primary_result_purpose: convertToStringArray(docExpected.primary_result_purpose),
      node_id: convertToStringArray(docExpected.node_id),
      instrument_type: convertToStringArray(docExpected.instrument_type),
      facility_country: convertToStringArray(docExpected.facility_country),
      facility_type: convertToStringArray(docExpected.facility_type),
      facility_description: convertToStringArray(docExpected.facility_description),
      telescope_description: convertToStringArray(docExpected.telescope_description),
      telescope_aperture: convertToStringArray(docExpected.telescope_aperture),
      instrument_name: convertToStringArray(docExpected.instrument_name),
      investigation_ref: convertToStringArray(docExpected.investigation_ref),
      citation_publication_year: convertToStringArray(docExpected.citation_publication_year)
    }

    if (docExpected.collection_type) {
      doc.collection_type = convertToStringArray(docExpected.collection_type)
    }

    if (docExpected.investigation_description) {
      doc.investigation_description = convertToStringArray(docExpected.investigation_description)
    }

    if (docExpected.instrument_host_name) {
      doc.instrument_host_name = convertToStringArray(docExpected.instrument_host_name)
    }

    if (docExpected.investigation_start_date) {
      doc.investigation_start_date = convertToStringArray(docExpected.investigation_start_date)
    }

    if (docExpected.investigation_stop_date) {
      doc.investigation_stop_date = convertToStringArray(docExpected.investigation_stop_date)
    }

    if (docExpected.instrument_description) {
      doc.instrument_description = convertToStringArray(docExpected.instrument_description)
    }

    if (docExpected['form-instrument-host']) {
      doc['form-instrument-host'] = convertToStringArray(docExpected['form-instrument-host'])
    }

    if (docExpected.citation_doi) {
      doc.citation_doi = convertToStringArray(docExpected.citation_doi)
    }

    if (docExpected.primary_result_processing_level) {
      doc.primary_result_processing_level = convertToStringArray(
        docExpected.primary_result_processing_level
      )
    }

    if (docExpected.observation_start_date_time) {
      doc.observation_start_date_time = convertToStringArray(
        docExpected.observation_start_date_time
      )
    }

    if (docExpected.observation_stop_date_time) {
      doc.observation_stop_date_time = convertToStringArray(docExpected.observation_stop_date_time)
    }

    if (docExpected.investigation_name) {
      doc.investigation_name = convertToStringArray(docExpected.investigation_name)
    }

    if (docExpected.primary_result_discipline_name) {
      doc.primary_result_discipline_name = convertToStringArray(
        docExpected.primary_result_discipline_name
      )
    }

    if (docExpected.target_type) {
      doc.target_type = convertToStringArray(docExpected.target_type)
    }

    if (docExpected.service_url) {
      doc.service_url = convertToStringArray(docExpected.service_url)
    }

    if (docExpected.version_id) {
      doc.version_id = convertToStringArray(docExpected.version_id)
    }

    if (docExpected.service_category) {
      doc.service_category = convertToStringArray(docExpected.service_category)
    }

    if (docExpected['form-target']) {
      doc['form-target'] = convertToStringArray(docExpected['form-target'])
    }

    if (docExpected.target_description) {
      doc.target_description = convertToStringArray(docExpected.target_description)
    }

    if (docExpected.instrument_host_description) {
      doc.instrument_host_description = convertToStringArray(
        docExpected.instrument_host_description
      )
    }

    formattedData.push(doc)
  })

  return formattedData
}

const transformResponse = (data: ResponseExpected) => {
  const formattedData: Response = {
    numFound: data.numFound,
    start: data.start,
    maxScore: data.maxScore,
    docs: transformDocs(data.docs)
  }

  return formattedData
}

const transformSolrSearchResponseExpected = (data: SolrSearchResponseExpected) => {
  const formattedData: SolrSearchResponse = {
    response: transformResponse(data.response),
    responseHeader: data.responseHeader,
    facet_counts: data.facet_counts
  }

  return formattedData
}

export const formatSearchResults = (data: SolrSearchResponseExpected) => {
  const formattedData: SolrSearchResponse = transformSolrSearchResponseExpected(data)

  return formattedData
}

const transformIdentifierNameDocs = (data: IdentifierNameDocExpected[]) => {
  const formattedData: IdentifierNameDoc[] = []

  data.forEach((docExpected) => {
    const doc = {
      identifier: convertToStringArray(docExpected.identifier),
      investigation_name: convertToStringArray(docExpected.investigation_name),
      instrument_name: convertToStringArray(docExpected.instrument_name),
      target_name: convertToStringArray(docExpected.target_name),
      title: convertToStringArray(docExpected.title)
    }

    formattedData.push(doc)
  })

  return formattedData
}

const transformIdentifierNameResponse = (data: IdentifierNameResponseExpected) => {
  const formattedData: IdentifierNameResponse = {
    numFound: data.numFound,
    start: data.start,
    maxScore: data.maxScore,
    docs: transformIdentifierNameDocs(data.docs)
  }

  return formattedData
}

const transformSolrIdentifierNameResponse = (data: SolrIdentifierNameResponseExpected) => {
  const formattedData: SolrIdentifierNameResponse = {
    response: transformIdentifierNameResponse(data.response),
    responseHeader: data.responseHeader,
    facet_counts: data.facet_counts
  }

  return formattedData
}

export const formatIdentifierNameResults = (data: SolrIdentifierNameResponseExpected) => {
  const formattedData: SolrIdentifierNameResponse = transformSolrIdentifierNameResponse(data)

  return formattedData
}

export const organizeIdsByRefName = (
  ids: SolrIdentifierNameResponse,
  refName: 'investigation_ref' | 'instrument_ref' | 'target_ref' | 'page_type'
) => {
  if (
    ids.facet_counts.facet_fields[refName]
      && ids.facet_counts.facet_fields[refName].length > 0
  ) {
    return ids.facet_counts.facet_fields[refName]
  }

  return []
}

export const mapFilterIdsToName = (
  ids: string[],
  names: IdentifierNameDoc[],
  searchResultFacets?: (number | string)[]
) => {
  const filtersMap: { name: string; identifier: string, count: string }[] = []

  ids.forEach((id, index) => {
    if (index % 2 === 0) {
      const urnSplit = id.split('::')[0]
      const nameDoc = names.find((name) => name.identifier[0] === urnSplit)
      let count = ids[index + 1]

      if (searchResultFacets) {
        const searchResultFacetIndex = searchResultFacets.indexOf(urnSplit)
        if (searchResultFacetIndex === -1) {
          count = '0'
        } else {
          count = String(searchResultFacets[searchResultFacetIndex + 1])
        }
      }

      if (nameDoc) {
        let name: string = ''

        if (nameDoc.title) {
          [name] = nameDoc.title
        }

        filtersMap.push({
          name,
          identifier: id,
          count
        })
      }
    }
  })

  return filtersMap
}

export const mapPageType = (ids: string[], searchResultFacets?: (number | string)[]) => {
  const filtersMap: { name: string; identifier: string, count: string }[] = []
  ids.forEach((id, index) => {
    if (index % 2 === 0) {
      let count = ids[index + 1]

      if (searchResultFacets) {
        const searchResultFacetIndex = searchResultFacets.indexOf(id)
        if (searchResultFacetIndex === -1) {
          count = '0'
        } else {
          count = String(searchResultFacets[searchResultFacetIndex + 1])
        }
      }

      filtersMap.push({
        name: id,
        identifier: id,
        count
      })
    }
  })

  return filtersMap
}

const getDocType = (doc: SearchResultDoc) => {
  let docType = ''
  if (doc.product_class) {
    if (doc.product_class[0].toLowerCase() === 'product_data_set_pds3') {
      docType = 'data set'
    }

    if (doc.product_class[0].toLowerCase() === 'product_bundle') {
      docType = 'data bundle'
    }

    if (doc.product_class[0].toLowerCase() === 'product_collection') {
      if (doc.collection_type) {
        if (doc.collection_type[0] !== 'document') {
          docType = 'data collection'
        }
      } else {
        docType = 'data collection'
      }
    }

    if (doc.product_class[0].toLowerCase() === 'product_service') {
      docType = 'tool'
    }

    if (
      doc.product_class[0].toLowerCase() === 'product_document'
            || (doc.collection_type
                && doc.collection_type[0].toLowerCase() === 'document')
    ) {
      docType = 'resource'
    }

    if (doc.product_class[0].toLowerCase() === 'product_context') {
      if (
        doc.data_class
                && doc.data_class[0].toLowerCase() === 'investigation'
      ) {
        docType = 'investigation portal'
      }

      if (
        doc.data_class
                && doc.data_class[0].toLowerCase() === 'instrument'
      ) {
        docType = 'instrument portal'
      }

      if (
        doc.data_class
                && doc.data_class[0].toLowerCase() === 'instrument_host'
      ) {
        docType = 'instrument host portal'
      }

      if (doc.data_class && doc.data_class[0].toLowerCase() === 'telescope') {
        docType = 'telescope portal'
      }

      if (doc.data_class && doc.data_class[0].toLowerCase() === 'target') {
        docType = 'target portal'
      }

      if (doc.data_class && doc.data_class[0].toLowerCase() === 'facility') {
        docType = 'facility portal'
      }
    }
  }

  return docType
}

const convertDataDates = (timeStamp: string[], modificationDate: string[]) => {
  type dateLog = {
    Date: string; // ISO 8601 format string
    Type: 'CREATE' | 'UPDATE' | 'DELETE';
  };

  const dates: dateLog[] = []
  if (modificationDate) {
    const date: dateLog = {
      Date: modificationDate[0],
      Type: 'CREATE'
    }

    dates.push(date)
  } else {
    const date: dateLog = {
      Date: timeStamp[0],
      Type: 'CREATE'
    }

    dates.push(date)
  }

  return dates
}

const pdsEndpoint = 'http://pds.nasa.gov'

const getDefaultLink = (doc: SearchResultDoc) => {
  let link = pdsEndpoint

  if (doc.resLocation) {
    link += doc.resLocation[0]
  }

  return link
}

const getLinkToBundleDetailPage = (doc: SearchResultDoc) => {
  const link = `/bundles/${doc.identifier[0]}`

  return link
}

const getLinkToCollectionDetailPage = (doc: SearchResultDoc) => {
  const link = `/collections/${doc.identifier[0]}`

  return link
}

const getLinkToInvestigationDetailPage = (doc: SearchResultDoc) => {
  const link = `/investigations/${doc.identifier[0]}`

  return link
}

const getLinkToInstrumentDetailPage = (doc: SearchResultDoc) => {
  const link = `/instruments/${doc.identifier[0]}`

  return link
}

/**
 * Some Instrument_Host records in Solr are incorrectly tagged with more than one
 * investigation_ref, when an instrument host should only ever belong to one
 * investigation. This has been reported and verified as a Solr-side data issue
 * that will be corrected at the source. Until then, this hardcoded map is the
 * agreed-upon quick fix: it overrides the investigation_ref used to build the
 * link for the affected instrument hosts (keyed by their identifier/LID).
 * Remove this map once the underlying Solr data is fixed.
 */
const instrumentHostInvestigationRefOverrides: Record<string, string> = {
  'urn:nasa:pds:context:instrument_host:spacecraft.go': 'urn:nasa:pds:context:investigation:mission.galileo',
  'urn:nasa:pds:context:instrument_host:spacecraft.hst': 'urn:nasa:pds:context:investigation:mission.hst',
  'urn:nasa:pds:context:instrument_host:spacecraft.clps_to_2im_ncll': 'urn:nasa:pds:context:investigation:mission.clps_to_2im',
  'urn:nasa:pds:context:instrument_host:spacecraft.p10': 'urn:nasa:pds:context:investigation:mission.pioneer_10',
  'urn:nasa:pds:context:instrument_host:spacecraft.pvo': 'urn:nasa:pds:context:investigation:mission.pioneer_venus',
  'urn:nasa:pds:context:instrument_host:spacecraft.clps_to_2ab_pll': 'urn:nasa:pds:context:investigation:mission.clps_to_2ab',
  'urn:nasa:pds:context:instrument_host:spacecraft.dif': 'urn:nasa:pds:context:investigation:mission.deep_impact',
  'urn:esa:psa:context:instrument_host:spacecraft.gio': 'urn:esa:psa:context:investigation:mission.giotto',
  'urn:esa:psa:context:instrument_host:spacecraft.iue': 'urn:esa:psa:context:investigation:mission.iue',
  'urn:nasa:pds:context:instrument_host:spacecraft.liciacube': 'urn:nasa:pds:context:investigation:mission.light_italian_cubesat_for_imaging_of_asteroids',
  'urn:nasa:pds:context:instrument_host:spacecraft.nh': 'urn:nasa:pds:context:investigation:mission.new_horizons',
  'urn:nasa:pds:context:instrument_host:spacecraft.sdu': 'urn:nasa:pds:context:investigation:mission.stardust',
  'urn:nasa:pds:context:instrument_host:spacecraft.vo2': 'urn:nasa:pds:context:investigation:mission.viking',
  'urn:nasa:pds:context:instrument_host:spacecraft.wise': 'urn:nasa:pds:context:investigation:mission.wise',
  'urn:nasa:pds:context:instrument_host:spacecraft.vg2': 'urn:nasa:pds:context:investigation:mission.voyager'
}

const getLinkToInstrumentHostDetailPage = (doc: SearchResultDoc) => {
  const instrumentHostId = doc.identifier[0]

  let investigationRef = instrumentHostInvestigationRefOverrides[instrumentHostId]

  if (!investigationRef && doc.investigation_ref && doc.investigation_ref.length > 0) {
    [investigationRef] = doc.investigation_ref
  }

  if (!investigationRef) {
    return getDefaultLink(doc)
  }

  return `/investigations/${encodeURIComponent(investigationRef)}/instrument-hosts`
}

const getLinkToTargetDetailPage = (doc: SearchResultDoc) => {
  const link = `/targets/${doc.identifier[0]}`

  return link
}

const getLinkToTelescopeDetailPage = (doc: SearchResultDoc) => {
  const link = `/telescopes/${doc.identifier[0]}`

  return link
}

const getLinkToFacilityDetailPage = (doc: SearchResultDoc) => {
  const link = `/facilities/${doc.identifier[0]}`

  return link
}

const getLinkToToolDetailPage = (doc: SearchResultDoc) => {
  let link = getDefaultLink(doc)

  if (doc.service_url && doc.service_url.length > 0) {
    [link] = doc.service_url
  }

  return link
}

/** Minimal PHP-like formatter for UTC dates. Supports Y, m, d, H, i, s */
function formatDateUTC(date: Date, format: string): string {
  const pad = (n: number, len = 2) => String(n).padStart(len, '0')

  const tokens: Record<string, string> = {
    // Year
    Y: String(date.getUTCFullYear()),
    // Month (01-12)
    m: pad(date.getUTCMonth() + 1),
    // Day of month (01-31)
    d: pad(date.getUTCDate()),
    // Hour (00-23)
    H: pad(date.getUTCHours()),
    // Minutes (00-59)
    i: pad(date.getUTCMinutes()),
    // Seconds (00-59)
    s: pad(date.getUTCSeconds())
  }

  // Replace token characters without interfering with other characters.
  // This handles simple formats like 'm-d-Y', 'Y-m-d', 'm/d/Y', 'Y-m-d H:i:s'
  return format.replace(/[YmdHis]/g, (t) => tokens[t] ?? t)
}

/**
 * Returns the UTC date string in the specified format.
 * - Accepts ISO-like date strings (e.g., '2024-12-31T23:59:59Z').
 * - Returns null if the input is null/undefined or cannot be parsed.
 *
 * Supported PHP-like tokens: Y, m, d, H, i, s
 * (You can extend this as needed.)
 */
export function getUtcDateString(
  dateString: string | null | undefined,
  format: string
): string | null {
  if (!dateString) return null

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return null

  return formatDateUTC(date, format)
}

/**
 * Returns the temporal coverage string for the given start and stop date times.
 *
 * Mirrors the PHP version:
 * - If start is null/undefined => returns empty string.
 * - Formats dates in UTC using the given PHP-like format (default 'm-d-Y').
 * - If stop is null/empty/'3000-01-01T00:00:00.000Z' => uses '(ONGOING)'.
 */
export function getTemporalCoverage(
  startDateTime: string | null | undefined,
  stopDateTime: string | null | undefined,
  temporalCoverageFormat: string = 'm-d-Y'
): string {
  if (startDateTime == null) {
    return ''
  }

  console.log(`getTemporalCoverage ${startDateTime}`, stopDateTime)

  const formattedStart = getUtcDateString(startDateTime, temporalCoverageFormat)

  let formattedStop = ''
  if (
    stopDateTime == null
    || stopDateTime === ''
    || stopDateTime === '3000-01-01T00:00:00.000Z'
  ) {
    formattedStop = '(ONGOING)'
  } else {
    formattedStop = getUtcDateString(stopDateTime, temporalCoverageFormat) ?? ''
  }

  return `Temporal Coverage: ${formattedStart ?? ''} to ${formattedStop}`
}

const generateSearchResultLinkPath = (pageType: string, doc: SearchResultDoc) => {
  let link = ''

  switch (pageType) {
    case 'data set':
      link = getDefaultLink(doc)
      break
    case 'data bundle':
      link = getLinkToBundleDetailPage(doc)
      break
    case 'data collection':
      link = getLinkToCollectionDetailPage(doc)
      break
    case 'tool':
      link = getLinkToToolDetailPage(doc)
      break
    case 'resource':
      link = getDefaultLink(doc)
      break
    case 'investigation portal':
      link = getLinkToInvestigationDetailPage(doc)
      break
    case 'instrument portal':
      link = getLinkToInstrumentDetailPage(doc)
      break
    case 'instrument host portal':
      link = getLinkToInstrumentHostDetailPage(doc)
      break
    case 'telescope portal':
      link = getLinkToTelescopeDetailPage(doc)
      break
    case 'target portal':
      link = getLinkToTargetDetailPage(doc)
      break
    case 'facility portal':
      link = getLinkToFacilityDetailPage(doc)
      break
    default:
      link = ''
  }

  return link
}

export const convertPdsDataToAppData = (pdsData: SolrSearchResponse) => {
  const items: any[] = []

  /*
  PdsData.response.docs.forEach((doc) => {
    const item = {
      meta: {
        'concept-id': 'C2808090209-ORNL_CLOUD',
        'concept-type': 'collection',
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'has-combine': false,
        'has-formats': false,
        'has-spatial-subsetting': false,
        'has-temporal-subsetting': false,
        'has-transforms': false,
        'has-variables': false,
        'native-id': 'BOREAS/AES MARS-II 15-minute Surface Meteorological Data: 1994',
        'provider-id': 'ORNL_CLOUD',
        'revision-date': '2025-10-28T06:16:58.087Z',
        'revision-id': 16,
        's3-links': ['s3://ornl-cumulus-prod-protected/boreas/STAFF/marsii94/data', 's3://ornl-cumulus-prod-public/boreas/STAFF/marsii94'],
        'user-id': 'jewellbc'
      },
      umm: {
        Abstract: doc.description,
        AncillaryKeywords: ['ATMOSPHERIC PRESSURE', 'WIND DIRECTION', 'WIND SPEED', 'RELATIVE HUMIDITY', 'TEMPERATURE', 'SURFACE METEOROLOGY', 'PRECIPITATION', 'DEW POINT', 'CLOUD COVER', 'VISIBILITY'],
        ArchiveAndDistributionInformation: {
          FileDistributionInformation: [
            {
              Format: 'ASCII',
              TotalCollectionFileSize: 6.74,
              TotalCollectionFileSizeUnit: 'MB'
            }
          ]
        },
        CollectionCitations: [
          {
            OtherCitationDetails: 'Atkinson, G.B., and B. Funk. 1998. BOREAS/AES MARS-II 15-minute Surface Meteorological Data: 1994. ORNL DAAC, Oak Ridge, Tennessee, USA. http://dx.doi.org/10.3334/ORNLDAAC/407'
          }
        ],
        CollectionProgress: 'COMPLETE',
        DOI: {
          DOI: '10.3334/ORNLDAAC/407',
          Authority: 'https://doi.org'
        },
        DataCenters: [
          {
            ContactInformation: {
              Addresses: [
                {
                  City: 'Oak Ridge',
                  Country: 'USA',
                  PostalCode: '37831-6407',
                  StateProvince: 'Tennessee',
                  StreetAddresses: ['ORNL DAAC User Services Office, P.O. Box 2008, MS 6407, Oak Ridge National Laboratory']
                }
              ]
            },
            LongName: 'THE OAK RIDGE NATIONAL LABORATORY (ORNL) DISTRIBUTED ACTIVE ARCHIVE CENTER (DAAC)',
            Roles: 'ARCHIVER',
            ShortName: 'ORNL_DAAC'
          }
        ],
        DataDates: [
          {
            Date: '1999-01-30T00:00:00.000Z',
            Type: 'CREATE'
          },
          {
            Date: '2023-11-22T21:20:21.000Z',
            Type: 'UPDATE'
          }
        ],
        DirectDistributionInformation: {
          Region: 'us-west-2',
          S3BucketAndObjectPrefixNames: ['s3://ornl-cumulus-prod-protected/boreas/STAFF/marsii94/data', 's3://ornl-cumulus-prod-public/boreas/STAFF/marsii94'],
          S3CredentialsAPIDocumentationURL: 'https://data.ornldaac.earthdata.nasa.gov/s3credentialsREADME',
          S3CredentialsAPIEndpoint: 'https://data.ornldaac.earthdata.nasa.gov/s3credentials'
        },
        EntryTitle: doc.title,
        MetadataSpecification: {
          URL: 'https://cdn.earthdata.nasa.gov/umm/collection/v1.18.4',
          Name: 'UMM-C',
          Version: '1.18.4'
        },
        Platforms: [
          {
            Instruments: [
              {
                LongName: 'CEILOMETERS',
                ShortName: 'CEILOMETERS'
              }
            ],
            LongName: 'METEOROLOGICAL STATIONS',
            ShortName: 'METEOROLOGICAL STATIONS',
            Type: 'Permanent Land Sites'
          }
        ],
        ProcessingLevel: {
          Id: '3',
          ProcessingLevelDescription: 'Variables mapped on uniform space-time grid scales with completeness and consistency'
        },
        Projects: [
          {
            LongName: 'Boreal Ecosystem-Atmosphere Study',
            ShortName: 'BOREAS'
          }
        ],
        RelatedUrls: [
          {
            Description: 'Earthdata Search allows users to search, discover, visualize, refine, and access NASA Earth Observation data.',
            Subtype: 'Earthdata Search',
            Type: 'GET DATA',
            URL: 'https://search.earthdata.nasa.gov/search?q=marsii94_407&ac=true',
            URLContentType: 'DistributionURL'
          }
        ],
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Term: 'CLOUDS',
            Topic: 'ATMOSPHERE',
            VariableLevel1: 'CLOUD PROPERTIES',
            VariableLevel2: 'CLOUD VERTICAL DISTRIBUTION'
          }
        ],
        ShortName: 'marsii94_407',
        SpatialExtent: {
          GranuleSpatialRepresentation: 'CARTESIAN',
          HorizontalSpatialDomain: {
            Geometry: {
              BoundingRectangles: {
                EastBoundingCoordinate: -97.55,
                NorthBoundingCoordinate: 59.56,
                SouthBoundingCoordinate: 51.08,
                WestBoundingCoordinate: -108.43
              }
            }
          },
          SpatialCoverageType: 'HORIZONTAL'
        },
        StandardProduct: false,
        TemporalExtents: [
          {
            EndsAtPresentFlag: false,
            RangeDateTimes: [
              {
                BeginningDateTime: '1994-05-24T00:00:00.000Z',
                EndingDateTime: '1994-09-20T23:59:59.999Z'
              }
            ]
          }
        ],
        UseConstraints: {
          LicenseURL: {
            Description: 'License URL for data use policy',
            Linkage: 'https://science.nasa.gov/earth-science/earth-science-data/data-information-policy',
            MimeType: 'text/html',
            Name: 'Data Use Policy'
          }
        },
        Version: '1'
      }
    }

    items.push(item)
  })
  */

  pdsData.response.docs.forEach((doc) => {
    let dataDates
    if (doc.timestamp && doc.modification_date) {
      dataDates = convertDataDates(doc.timestamp, doc.modification_date)
    }

    const pageType = getDocType(doc)
    const resultLink = generateSearchResultLinkPath(pageType, doc)

    const item = {
      meta: {
        'concept-id': '',
        'concept-type': '',
        deleted: false,
        format: '',
        'has-combine': false,
        'has-formats': false,
        'has-spatial-subsetting': false,
        'has-temporal-subsetting': false,
        'has-transforms': false,
        'has-variables': false,
        'native-id': '',
        'provider-id': '',
        'revision-date': '',
        'revision-id': 1,
        's3-links': [],
        'user-id': ''
      },
      umm: {
        Abstract: doc.description,
        AncillaryKeywords: ['ATMOSPHERIC PRESSURE', 'WIND DIRECTION', 'WIND SPEED', 'RELATIVE HUMIDITY', 'TEMPERATURE', 'SURFACE METEOROLOGY', 'PRECIPITATION', 'DEW POINT', 'CLOUD COVER', 'VISIBILITY'],
        ArchiveAndDistributionInformation: {
          FileDistributionInformation: [
            {
              Format: 'ASCII',
              TotalCollectionFileSize: 6.74,
              TotalCollectionFileSizeUnit: 'MB'
            }
          ]
        },
        CollectionCitations: [
          {
            OtherCitationDetails: 'Atkinson, G.B., and B. Funk. 1998. BOREAS/AES MARS-II 15-minute Surface Meteorological Data: 1994. ORNL DAAC, Oak Ridge, Tennessee, USA. http://dx.doi.org/10.3334/ORNLDAAC/407'
          }
        ],
        CollectionProgress: 'COMPLETE',
        DOI: {
          DOI: '10.3334/ORNLDAAC/407',
          Authority: 'https://doi.org'
        },
        DataCenters: [
          {
            ContactInformation: {
              Addresses: [
                {
                  City: 'Oak Ridge',
                  Country: 'USA',
                  PostalCode: '37831-6407',
                  StateProvince: 'Tennessee',
                  StreetAddresses: ['ORNL DAAC User Services Office, P.O. Box 2008, MS 6407, Oak Ridge National Laboratory']
                }
              ]
            },
            LongName: 'THE OAK RIDGE NATIONAL LABORATORY (ORNL) DISTRIBUTED ACTIVE ARCHIVE CENTER (DAAC)',
            Roles: 'ARCHIVER',
            ShortName: 'ORNL_DAAC'
          }
        ],
        DataDates: dataDates,
        DirectDistributionInformation: {
          Region: 'us-west-2',
          S3BucketAndObjectPrefixNames: ['s3://ornl-cumulus-prod-protected/boreas/STAFF/marsii94/data', 's3://ornl-cumulus-prod-public/boreas/STAFF/marsii94'],
          S3CredentialsAPIDocumentationURL: 'https://data.ornldaac.earthdata.nasa.gov/s3credentialsREADME',
          S3CredentialsAPIEndpoint: 'https://data.ornldaac.earthdata.nasa.gov/s3credentials'
        },
        EntryTitle: doc.title,
        MetadataSpecification: {
          URL: 'https://cdn.earthdata.nasa.gov/umm/collection/v1.18.4',
          Name: 'UMM-C',
          Version: '1.18.4'
        },
        Link: resultLink,
        PageType: pageType,
        Platforms: [
          {
            Instruments: [
              {
                LongName: 'CEILOMETERS',
                ShortName: 'CEILOMETERS'
              }
            ],
            LongName: 'METEOROLOGICAL STATIONS',
            ShortName: 'METEOROLOGICAL STATIONS',
            Type: 'Permanent Land Sites'
          }
        ],
        ProcessingLevel: {
          Id: '3',
          ProcessingLevelDescription: 'Variables mapped on uniform space-time grid scales with completeness and consistency'
        },
        Projects: [
          {
            LongName: 'Boreal Ecosystem-Atmosphere Study',
            ShortName: 'BOREAS'
          }
        ],
        RelatedUrls: [
          {
            Description: 'Earthdata Search allows users to search, discover, visualize, refine, and access NASA Earth Observation data.',
            Subtype: 'Earthdata Search',
            Type: 'GET DATA',
            URL: 'https://search.earthdata.nasa.gov/search?q=marsii94_407&ac=true',
            URLContentType: 'DistributionURL'
          }
        ],
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Term: 'CLOUDS',
            Topic: 'ATMOSPHERE',
            VariableLevel1: 'CLOUD PROPERTIES',
            VariableLevel2: 'CLOUD VERTICAL DISTRIBUTION'
          }
        ],
        ShortName: 'marsii94_407',
        SpatialExtent: {
          GranuleSpatialRepresentation: 'CARTESIAN',
          HorizontalSpatialDomain: {
            Geometry: {
              BoundingRectangles: {
                EastBoundingCoordinate: -97.55,
                NorthBoundingCoordinate: 59.56,
                SouthBoundingCoordinate: 51.08,
                WestBoundingCoordinate: -108.43
              }
            }
          },
          SpatialCoverageType: 'HORIZONTAL'
        },
        StandardProduct: false,
        TemporalExtents: [
          {
            EndsAtPresentFlag: false,
            RangeDateTimes: [
              {
                BeginningDateTime: '1994-05-24T00:00:00.000Z',
                EndingDateTime: '1994-09-20T23:59:59.999Z'
              }
            ]
          }
        ],
        TimeExtent: doc.observation_start_date_time && doc.observation_stop_date_time ? getTemporalCoverage(doc.observation_start_date_time[0], doc.observation_stop_date_time[0], 'm-d-Y') : '',
        UseConstraints: {
          LicenseURL: {
            Description: 'License URL for data use policy',
            Linkage: 'https://science.nasa.gov/earth-science/earth-science-data/data-information-policy',
            MimeType: 'text/html',
            Name: 'Data Use Policy'
          }
        },
        Version: '1'
      }
    }

    items.push(item)
  })

  const data: any = {
    'cmr-hits': pdsData.response.numFound,
    items
  }

  return data
}

interface FilterOption {
    name: string;
    identifier: string;
    count: string;
}

interface PdsChild {
  title: string;
  type: string;
  applied: boolean;
  count: string;
  links: {
    remove: string;
    apply?: undefined } | { apply: string; remove?: undefined };
    has_children: boolean
}

const checkIfAdded = (filterOption: FilterOption, topics: string[]) => {
  const isAdded = topics.includes(filterOption.identifier)

  return isAdded
}

const generateLinks = (
  facetFilterType: string,
  cmrParams: PdsCmrParams,
  facet: FilterOption,
  isAdded: boolean
) => {
  let link = '?'

  if (cmrParams.page_types) {
    let index = 0
    const topics = cmrParams.page_types.map((item) => item.topic)

    topics.forEach((topic) => {
      if (!isAdded || topic !== facet.identifier) {
        link += `&page_types[${index}][topic]=${topic}`
        index += 1
      }
    })

    if (!isAdded && facetFilterType === 'page_types') {
      link = `${link}&page_types[${index}][topic]=${facet.identifier}`
    }
  } else if (facetFilterType === 'page_types') {
    link = `${link}&page_types[0][topic]=${facet.identifier}`
  }

  if (cmrParams.investigations) {
    let index = 0
    const topics = cmrParams.investigations.map((item) => item.topic)

    topics.forEach((topic) => {
      if (!isAdded || topic !== facet.identifier) {
        link += `&investigations[${index}][topic]=${topic}`
        index += 1
      }
    })

    if (!isAdded && facetFilterType === 'investigations') {
      link = `${link}&investigations[${index}][topic]=${facet.identifier}`
    }
  } else if (facetFilterType === 'investigations') {
    link = `${link}&investigations[0][topic]=${facet.identifier}`
  }

  if (cmrParams.instruments) {
    let index = 0
    const topics = cmrParams.instruments.map((item) => item.topic)

    topics.forEach((topic) => {
      if (!isAdded || topic !== facet.identifier) {
        link += `&instruments[${index}][topic]=${topic}`
        index += 1
      }
    })

    if (!isAdded && facetFilterType === 'instruments') {
      link = `${link}&instruments[${index}][topic]=${facet.identifier}`
    }
  } else if (facetFilterType === 'instruments') {
    link = `${link}&instruments[0][topic]=${facet.identifier}`
  }

  if (cmrParams.targets) {
    let index = 0
    const topics = cmrParams.targets.map((item) => item.topic)

    topics.forEach((topic) => {
      if (!isAdded || topic !== facet.identifier) {
        link += `&targets[${index}][topic]=${topic}`
        index += 1
      }
    })

    if (!isAdded && facetFilterType === 'targets') {
      link = `${link}&targets[${index}][topic]=${facet.identifier}`
    }
  } else if (facetFilterType === 'targets') {
    link = `${link}&targets[0][topic]=${facet.identifier}`
  }

  if (isAdded) {
    return {
      remove: link
    }
  }

  return {
    apply: link
  }
}

export const convertPdsFacetDataToAppFacetData = (
  pageTypes: FilterOption[],
  investigations: FilterOption[],
  instruments: FilterOption[],
  targets: FilterOption[],
  cmrParams: PdsCmrParams
) => {
  const appFacetChildren = []
  const pageTypeChildren: PdsChild[] = []
  const investigationChildren: PdsChild[] = []
  const instrumentChildren: PdsChild[] = []
  const targetChildren: PdsChild[] = []

  pageTypes.forEach((facet) => {
    let isAdded = false

    console.log('cmrParams.page_types', cmrParams.page_types)
    if (cmrParams.page_types) {
      const pageTypeTopics = cmrParams.page_types.map((item) => item.topic)
      isAdded = checkIfAdded(facet, pageTypeTopics)
    }

    const links = generateLinks('page_types', cmrParams, facet, isAdded)

    pageTypeChildren.push({
      title: facet.name,
      type: 'filter',
      applied: isAdded,
      count: facet.count,
      links,
      has_children: true
    })
  })

  let appFacet = {
    title: 'PageTypes',
    type: 'group',
    applied: false,
    has_children: true,
    children: pageTypeChildren
  }

  appFacetChildren.push(appFacet)

  investigations.forEach((facet) => {
    let isAdded = false

    if (cmrParams.investigations) {
      const investigationTopics = cmrParams.investigations.map((item) => item.topic)
      isAdded = checkIfAdded(facet, investigationTopics)
    }

    const links = generateLinks('investigations', cmrParams, facet, isAdded)

    investigationChildren.push({
      title: facet.name,
      type: 'filter',
      applied: isAdded,
      count: facet.count,
      links,
      has_children: true
    })
  })

  appFacet = {
    title: 'Investigations',
    type: 'group',
    applied: false,
    has_children: true,
    children: investigationChildren
  }

  appFacetChildren.push(appFacet)

  instruments.forEach((facet) => {
    let isAdded = false

    if (cmrParams.instruments) {
      const instrumentTopics = cmrParams.instruments.map((item) => item.topic)
      isAdded = checkIfAdded(facet, instrumentTopics)
    }

    const links = generateLinks('instruments', cmrParams, facet, isAdded)

    instrumentChildren.push({
      title: facet.name,
      type: 'filter',
      applied: isAdded,
      count: facet.count,
      links,
      has_children: true
    })
  })

  appFacet = {
    title: 'Instruments',
    type: 'group',
    applied: false,
    has_children: true,
    children: instrumentChildren
  }

  appFacetChildren.push(appFacet)

  targets.forEach((facet) => {
    let isAdded = false

    if (cmrParams.targets) {
      const targetTopics = cmrParams.targets.map((item) => item.topic)
      isAdded = checkIfAdded(facet, targetTopics)
    }

    const links = generateLinks('targets', cmrParams, facet, isAdded)

    targetChildren.push({
      title: facet.name,
      type: 'filter',
      applied: isAdded,
      count: facet.count,
      links,
      has_children: true
    })
  })

  appFacet = {
    title: 'Targets',
    type: 'group',
    applied: false,
    has_children: true,
    children: targetChildren
  }

  appFacetChildren.push(appFacet)

  const appFacets = {
    title: 'Browse Collections',
    type: 'group',
    has_children: true,
    children: appFacetChildren
  }

  const data = {
    feed: {
      updated: '2026-01-06T18:03:27.453Z',
      id: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?include_facets=v2&page_size=0&consortium=EOSDIS&keyword=mars%2A',
      title: 'ECHO dataset metadata',
      entry: [],
      facets: appFacets
    }
  }

  return data
}

const generateFilterSubQuery = (topics: string[], filterName: string) => {
  let subQueryString = ''
  topics.forEach((topic, index) => {
    if (index === 0) {
      subQueryString = `${subQueryString
            + filterName
      }:"${
        topic
      }" OR identifier:"${
        topic
      }"`
    } else {
      subQueryString = `${subQueryString} OR ${
        filterName
      }:"${
        topic
      }" OR identifier:"${
        topic
      }"`
    }
  })

  return subQueryString
}

export const formatFilterQueries = (cmrParams: PdsCmrParams) => {
  let formattedFilterQueryString = ''
  if (cmrParams.page_types) {
    formattedFilterQueryString = `${formattedFilterQueryString}&fq=`
    const subQuery = generateFilterSubQuery(cmrParams.page_types.map((item) => item.topic), 'page_type')
    formattedFilterQueryString += subQuery
  }

  if (cmrParams.investigations) {
    formattedFilterQueryString = `${formattedFilterQueryString}&fq=`
    const subQuery = generateFilterSubQuery(cmrParams.investigations.map((item) => item.topic), 'investigation_ref')
    formattedFilterQueryString += subQuery
  }

  if (cmrParams.instruments) {
    formattedFilterQueryString = `${formattedFilterQueryString}&fq=`
    const subQuery = generateFilterSubQuery(cmrParams.instruments.map((item) => item.topic), 'instrument_ref')
    formattedFilterQueryString += subQuery
  }

  if (cmrParams.targets) {
    formattedFilterQueryString = `${formattedFilterQueryString}&fq=`
    const subQuery = generateFilterSubQuery(cmrParams.targets.map((item) => item.topic), 'target_ref')
    formattedFilterQueryString += subQuery
  }

  return formattedFilterQueryString
}
