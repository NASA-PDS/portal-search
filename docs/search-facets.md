# How Search Facets Update

This document explains how the search page builds its facets (Page Type, Investigations, Instruments, Targets) and how selecting a value narrows the other facets ([#31](https://github.com/NASA-PDS/portal-search/issues/31)).

Code:
- `formatFilterQueries`, `formatFacetFields` and `FILTER_GROUPS` in `src/ts/utils/pds/searchUtils.ts`
- The facet-count request in `queryFacetedCollections` (`src/ts/utils/queryFacetedCollections.ts`)

All data comes from the PDS Search API (`https://pds.nasa.gov/services/search/search`).

---

## The rule

> Each facet is counted against the keyword and **every selected filter except its own**.

So when you select a value:
- the **other** facets narrow to values that appear in the matching products, and
- the facet you selected from **keeps all its values**, so you can add more to the selection.

---

## The filter groups

Defined in `FILTER_GROUPS`:

| URL param        | Solr field          | Tag     |
|------------------|---------------------|---------|
| `page_types`     | `page_type`         | `ptype` |
| `investigations` | `investigation_ref` | `inv`   |
| `instruments`    | `instrument_ref`    | `ins`   |
| `targets`        | `target_ref`        | `tar`   |

The tags match the URL keys used by the Drupal home search.

---

## How it works

Every search (each keyword change or facet click) calls `queryFacetedCollections`, which sends two kinds of request.

### 1. Filter queries (shared by both requests)

`formatFilterQueries` builds one **tagged** `fq` per group that has selections. The values in a group are OR'd, and each value also matches the context product itself through `identifier`:

```
fq={!tag=tar}target_ref:"urn:...:satellite.earth.moon" OR identifier:"urn:...:satellite.earth.moon"
fq={!tag=inv}investigation_ref:"urn:...:mission.lunar_reconnaissance_orbiter" OR identifier:"urn:..."
```

Solr ANDs separate `fq` params, so:
- **within a group:** Moon OR Mars
- **across groups:** (Moon OR Mars) AND LRO

Groups with no selections are skipped. Every `fq` is URL-encoded.

### 2. Results request

```
?wt=json&qt=keyword&q=<keyword>&fq=...&fq=...&start=...&rows=...
```

Solr ignores tags here. The results are filtered by every selection.

### 3. Facet-count request

```
?wt=json&qt=keyword&rows=0&facet=on&facet.limit=-1
 &q=<keyword>
 &facet.field={!ex=ptype}page_type
 &facet.field={!ex=inv}investigation_ref
 &facet.field={!ex=ins}instrument_ref
 &facet.field={!ex=tar}target_ref
 &fq=...&fq=...
```

`{!ex=tag}` tells Solr to drop the filter carrying that tag **only while counting that field**. All four excludes are always sent. An exclude for a group with no selections does nothing.

Solr still returns each field under its plain name (`target_ref`, etc.), so the parsing code (`organizeIdsByRefName`, `mapFilterIdsToName`, `mapPageType`) is unchanged.

### 4. Display names

The three reference-data requests (`q=data_class:Investigation|Instrument|Target`) are not filtered. They only turn LIDs into readable names. A facet value with no matching reference title is not shown.

---

## Example

Counts from the live API (November 2026):

| Selection   | Products | Page Type | Investigations | Instruments | Targets     |
|-------------|---------:|----------:|---------------:|------------:|------------:|
| none        | 17,064   | 9         | 206            | 1,184       | 2,581       |
| Moon        | 1,582    | 5         | 48             | 250         | 2,581 (all) |
| LRO         | 923      | 4         | 206 (all)      | 14          | 1           |
| Moon + LRO  | 920      | 4         | 48             | 14          | 1           |

With **Moon + LRO**:
- **Targets** is filtered by LRO only (its own Moon filter is excluded).
- **Investigations** is filtered by Moon only.
- **Instruments** and **Page Type** are filtered by Moon **and** LRO.

---

## Compared with the Drupal home search

The Drupal home search (`PdsHomeForm.php`) narrows facets by reloading the page and making one facet request per selected group. This app follows the same idea with one request, and fixes three differences:

| Behaviour                          | Drupal home search                   | This app                       |
|------------------------------------|--------------------------------------|--------------------------------|
| Selected facet keeps its values    | First selected group only            | Every facet                    |
| Narrowing across groups            | Only by the group processed before   | Cumulative (all other groups)  |
| Depends on URL order               | Yes                                  | No                             |
| Keyword narrows facets             | No (`q` is empty)                    | Yes                            |
| Facet requests per search          | 1 + one per selected group           | 1                              |

---

## Tests

`src/ts/utils/__tests__/formatFilterQueries.test.ts` covers the tagged `fq` format, OR within a group, one `fq` per group, URL encoding, and that every exclude tag in `formatFacetFields` matches a filter tag.

To add a new facet group:
1. Add it to `FILTER_GROUPS` with a unique tag. `formatFilterQueries` and `formatFacetFields` both pick it up from there.
2. Add its URL param to `PdsCmrParams`.
3. Read and display it in `queryFacetedCollections` (`organizeIdsByRefName`) and `convertPdsFacetDataToAppFacetData`.
