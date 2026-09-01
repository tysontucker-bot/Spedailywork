import { useMemo, useState } from 'react'
import './App.css'
import { ArasaacSearchControl } from './ArasaacSearchControl'
import { Worksheet } from './Worksheet'
import {
  buildCvcChoices,
  createPictureSelection,
  formatMonthDay,
  getCvcValidationError,
  normalizeWord,
  type PictogramSelection,
} from './worksheetData'

const INITIAL_CVC_WORDS = ['sun', 'fox', 'cup']
const INITIAL_TRACE_COPY_WORDS = ['map', 'hen', 'cup']

function syncPictureQuery(previousPicture: PictogramSelection, previousWord: string, nextWord: string): PictogramSelection {
  const normalizedQuery = previousPicture.query.trim().toLowerCase()
  const normalizedPreviousWord = previousWord.trim().toLowerCase()

  if (!normalizedQuery || normalizedQuery === normalizedPreviousWord) {
    return {
      ...previousPicture,
      query: nextWord,
    }
  }

  return previousPicture
}

function App() {
  const [studentName, setStudentName] = useState('Jesse')
  const [date, setDate] = useState('2026-08-31')
  const [cvcWords, setCvcWords] = useState(INITIAL_CVC_WORDS)
  const [traceCopyWords, setTraceCopyWords] = useState(INITIAL_TRACE_COPY_WORDS)
  const [cvcPictures, setCvcPictures] = useState(() => INITIAL_CVC_WORDS.map(createPictureSelection))
  const [traceCopyPictures, setTraceCopyPictures] = useState(() => INITIAL_TRACE_COPY_WORDS.map(createPictureSelection))

  const cvcValidationErrors = useMemo(
    () => cvcWords.map(word => getCvcValidationError(word)),
    [cvcWords],
  )
  const interfaceErrors = cvcValidationErrors
    .map((error, index) => error ? `CVC Word ${index + 1}: ${error}` : null)
    .filter((error): error is string => error !== null)
  const worksheetDateLabel = formatMonthDay(date)
  const worksheetData = useMemo(() => ({
    cvcActivities: cvcWords.map((word, index) => ({
      word: normalizeWord(word),
      choices: buildCvcChoices(word, `cvc-${index}-${normalizeWord(word)}`),
      validationError: cvcValidationErrors[index],
      picture: cvcPictures[index],
    })),
    traceCopyActivities: traceCopyWords.map((word, index) => ({
      word: word.trim(),
      picture: traceCopyPictures[index],
    })),
  }), [cvcPictures, cvcValidationErrors, cvcWords, traceCopyPictures, traceCopyWords])

  return (
    <div className="teacher-interface">
      <header className="teacher-interface__header">
        <h1>CVC Worksheet Generator</h1>
        <p>Use this tool to create daily worksheets for your students.</p>
      </header>
      <div className="teacher-interface__controls no-print">
        <section className="teacher-control-group">
          <h2>Student Details</h2>
          <div className="teacher-control-grid teacher-control-grid--compact">
            <div className="teacher-field">
              <label htmlFor="student-name-input">Student Name</label>
              <input
                id="student-name-input"
                type="text"
                value={studentName}
                onChange={event => setStudentName(event.target.value)}
              />
            </div>
            <div className="teacher-field">
              <label htmlFor="date-input">Date</label>
              <input
                id="date-input"
                type="date"
                value={date}
                onChange={event => setDate(event.target.value)}
              />
              <p className="teacher-field__hint">
                Worksheet date: {worksheetDateLabel || 'Select a valid date.'}
              </p>
            </div>
          </div>
        </section>

        <section className="teacher-control-group">
          <h2>CVC Activity</h2>
          <div className="teacher-control-list">
            {cvcWords.map((word, index) => (
              <div key={`cvc-control-${index}`} className="teacher-word-row">
                <div className="teacher-field">
                  <label htmlFor={`cvc-word-${index}`}>CVC Word {index + 1}</label>
                  <input
                    id={`cvc-word-${index}`}
                    type="text"
                    value={word}
                    onChange={event => {
                      const nextWord = event.target.value
                      setCvcWords(currentWords => currentWords.map((entry, itemIndex) => (
                        itemIndex === index ? nextWord : entry
                      )))
                      setCvcPictures(currentPictures => currentPictures.map((picture, itemIndex) => (
                        itemIndex === index ? syncPictureQuery(picture, word, nextWord) : picture
                      )))
                    }}
                  />
                  {cvcValidationErrors[index] ? (
                    <p className="teacher-field__error">{cvcValidationErrors[index]}</p>
                  ) : (
                    <p className="teacher-field__hint">
                      Choices are generated automatically from the worksheet CVC list.
                    </p>
                  )}
                </div>
                <ArasaacSearchControl
                  controlId={`cvc-picture-${index}`}
                  label={`ARASAAC picture for CVC Word ${index + 1}`}
                  onChange={nextValue => {
                    setCvcPictures(currentPictures => currentPictures.map((picture, itemIndex) => (
                      itemIndex === index ? nextValue : picture
                    )))
                  }}
                  value={cvcPictures[index]}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="teacher-control-group">
          <h2>Trace &amp; Copy</h2>
          <div className="teacher-control-list">
            {traceCopyWords.map((word, index) => (
              <div key={`trace-copy-control-${index}`} className="teacher-word-row">
                <div className="teacher-field">
                  <label htmlFor={`trace-copy-word-${index}`}>Trace &amp; Copy Word {index + 1}</label>
                  <input
                    id={`trace-copy-word-${index}`}
                    type="text"
                    value={word}
                    onChange={event => {
                      const nextWord = event.target.value
                      setTraceCopyWords(currentWords => currentWords.map((entry, itemIndex) => (
                        itemIndex === index ? nextWord : entry
                      )))
                      setTraceCopyPictures(currentPictures => currentPictures.map((picture, itemIndex) => (
                        itemIndex === index ? syncPictureQuery(picture, word, nextWord) : picture
                      )))
                    }}
                  />
                </div>
                <ArasaacSearchControl
                  controlId={`trace-copy-picture-${index}`}
                  label={`ARASAAC picture for Trace & Copy Word ${index + 1}`}
                  onChange={nextValue => {
                    setTraceCopyPictures(currentPictures => currentPictures.map((picture, itemIndex) => (
                      itemIndex === index ? nextValue : picture
                    )))
                  }}
                  value={traceCopyPictures[index]}
                />
              </div>
            ))}
          </div>
        </section>

        {interfaceErrors.length > 0 && (
          <section className="teacher-control-group teacher-control-group--errors">
            <h2>Teacher Checks</h2>
            <ul className="teacher-error-list">
              {interfaceErrors.map(error => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <button
        className="print-button no-print"
        onClick={() => window.print()}
        type="button"
      >
        Print Worksheet
      </button>
      <Worksheet
        cvcActivities={worksheetData.cvcActivities}
        date={date}
        studentName={studentName}
        traceCopyActivities={worksheetData.traceCopyActivities}
      />
    </div>
  )
}

export default App
