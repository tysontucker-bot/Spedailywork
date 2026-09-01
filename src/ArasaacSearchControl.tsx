import { useMemo, useState } from 'react'
import { ArasaacPictogram } from './ArasaacPictogram'
import type { PictogramSelection } from './worksheetData'

interface ArasaacKeyword {
  keyword?: string
}

interface ArasaacSearchResponseItem {
  id?: number
  desc?: string
  keywords?: ArasaacKeyword[]
}

interface ArasaacOption {
  id: number
  label: string
}

interface ArasaacSearchControlProps {
  controlId: string
  label: string
  value: PictogramSelection
  onChange: (nextValue: PictogramSelection) => void
}

const ARASAAC_API_BASE = 'https://api.arasaac.org/v1'

function optionLabel(item: ArasaacSearchResponseItem): string {
  const keyword = item.keywords?.find(entry => entry.keyword?.trim())?.keyword?.trim()
  const description = item.desc?.trim()
  return keyword || description || `Pictogram ${item.id ?? ''}`.trim()
}

export function ArasaacSearchControl({
  controlId,
  label,
  value,
  onChange,
}: ArasaacSearchControlProps) {
  const [results, setResults] = useState<ArasaacOption[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [searchError, setSearchError] = useState('')
  const [previewFailed, setPreviewFailed] = useState(false)

  const selectedValue = value.pictogramId === null ? '' : String(value.pictogramId)
  const selectedLabel = value.pictogramId
    ? `${value.pictogramLabel || `Pictogram ${value.pictogramId}`} (ID ${value.pictogramId})`
    : ''

  const options = useMemo(() => {
    if (!value.pictogramId || results.some(option => option.id === value.pictogramId)) {
      return results
    }

    return [
      { id: value.pictogramId, label: value.pictogramLabel || `Pictogram ${value.pictogramId}` },
      ...results,
    ]
  }, [results, value.pictogramId, value.pictogramLabel])

  async function handleSearch() {
    const query = value.query.trim()

    if (!query) {
      setStatus('error')
      setSearchError('Enter a search term before searching ARASAAC.')
      setResults([])
      return
    }

    setStatus('loading')
    setSearchError('')

    try {
      const url = `${ARASAAC_API_BASE}/pictograms/en/bestsearch/${encodeURIComponent(query)}`
      console.log('ARASAAC REQUEST URL:', url)
      const response = await fetch(url)
      console.log('ARASAAC STATUS:', response.status)
      console.log('ARASAAC OK:', response.ok)
      console.log(
        'ARASAAC CONTENT TYPE:',
        response.headers.get('content-type'),
      )

      if (!response.ok) {
        throw new Error(`ARASAAC returned ${response.status}.`)
      }

      const rawResults = (await response.json()) as ArasaacSearchResponseItem[]
      console.log('ARASAAC RAW RESPONSE:', rawResults)
      console.log('ARASAAC RESPONSE TYPE:', typeof rawResults)
      console.log(
        'ARASAAC IS ARRAY:',
        Array.isArray(rawResults),
      )
      if (Array.isArray(rawResults)) {
        console.log('ARASAAC RESULT COUNT:', rawResults.length)
        console.log('ARASAAC FIRST RESULT:', rawResults[0])
      }
      const uniqueResults = Array.from(
        new Map(
          rawResults
            .filter(item => typeof item.id === 'number')
            .map(item => [item.id as number, { id: item.id as number, label: optionLabel(item) }]),
        ).values(),
      ).slice(0, 12)

      if (uniqueResults.length === 0) {
        setStatus('error')
        setSearchError(`No ARASAAC pictograms were found for "${query}".`)
        setResults([])
        return
      }

      setResults(uniqueResults)
      setStatus('success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown ARASAAC error.'
      setStatus('error')
      setSearchError(`ARASAAC search failed. ${message}`)
      setResults([])
    }
  }

  return (
    <div className="picture-search-control">
      <div className="picture-search-control__inputs">
        <label htmlFor={`${controlId}-query`}>{label}</label>
        <div className="picture-search-control__row">
          <input
            id={`${controlId}-query`}
            type="text"
            value={value.query}
            onChange={event => onChange({ ...value, query: event.target.value })}
          />
          <button type="button" onClick={() => void handleSearch()}>
            Search ARASAAC
          </button>
        </div>
        <label htmlFor={`${controlId}-select`}>Selected pictogram</label>
        <select
          id={`${controlId}-select`}
          value={selectedValue}
          onChange={event => {
            const nextValue = event.target.value
            const nextId = nextValue ? Number(nextValue) : null
            const selected = options.find(option => option.id === nextId)

            onChange({
              ...value,
              pictogramId: nextId,
              pictogramLabel: selected?.label || '',
            })
          }}
        >
          <option value="">Choose a search result</option>
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.label} (ID {option.id})
            </option>
          ))}
        </select>
        {selectedLabel && (
          <p className="picture-search-control__selected">{selectedLabel}</p>
        )}
        {status === 'loading' && (
          <p className="teacher-field__hint">Searching ARASAAC…</p>
        )}
        {status === 'success' && results.length > 0 && (
          <p className="teacher-field__hint">Choose from {results.length} ARASAAC result(s).</p>
        )}
        {searchError && (
          <p className="teacher-field__error">{searchError}</p>
        )}
        {previewFailed && value.pictogramId && (
          <p className="teacher-field__error">
            The selected ARASAAC pictogram could not be loaded. Choose a different result or try again later.
          </p>
        )}
      </div>
      <ArasaacPictogram
        alt={selectedLabel || label}
        className="picture-search-control__preview"
        emptyMessage="No ARASAAC pictogram selected."
        failureMessage="ARASAAC image unavailable."
        id={value.pictogramId}
        imageClassName="picture-search-control__preview-image"
        onLoadStateChange={setPreviewFailed}
      />
    </div>
  )
}
