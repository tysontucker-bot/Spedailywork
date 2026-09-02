import './Worksheet.css'
import { ArasaacPictogram } from './ArasaacPictogram'
import { PrimaryWritingArea } from './PrimaryWritingArea'
import type { PictogramSelection } from './worksheetData'
import { buildCalendar } from './worksheetData'

interface CvcActivity {
  word: string
  choices: string[]
  validationError: string | null
  picture: PictogramSelection
}

interface TraceCopyActivity {
  word: string
  picture: PictogramSelection
}

interface WorksheetProps {
  studentName: string
  date: string
  cvcActivities: CvcActivity[]
  traceCopyActivities: TraceCopyActivity[]
}

function Calendar({ date }: Pick<WorksheetProps, 'date'>) {
  const calendar = buildCalendar(date)

  return (
    <div className="ws-calendar">
      <div className="ws-calendar__month">{calendar.monthYear || 'Select a date'}</div>
      <div className="ws-calendar__grid">
        {calendar.weekdayLabels.map(label => (
          <div key={label} className="ws-calendar__weekday">
            {label}
          </div>
        ))}
        {calendar.weeks.flat().map((day, index) => (
          <div
            key={`${day ?? 'blank'}-${index}`}
            className={`ws-calendar__day${day !== null && day === calendar.selectedDay ? ' ws-calendar__day--selected' : ''}`}
          >
            {day ?? ''}
          </div>
        ))}
      </div>
    </div>
  )
}

function CvcActivityCard({ activity, index }: { activity: CvcActivity, index: number }) {
  return (
    <div className="ws-cvc-activity">
      <ArasaacPictogram
        alt={activity.picture.pictogramLabel || activity.word || `CVC activity ${index + 1}`}
        className="ws-cvc-activity__picture"
        emptyMessage="Select an ARASAAC pictogram."
        failureMessage="ARASAAC image unavailable."
        id={activity.picture.pictogramId}
        imageClassName="ws-cvc-activity__image"
      />
      <div className="ws-cvc-activity__choices">
        {(activity.validationError ? ['', '', ''] : activity.choices).map((choice, choiceIndex) => (
          <div key={`${choice || 'blank'}-${choiceIndex}`} className="ws-cvc-activity__choice">
            {choice}
          </div>
        ))}
      </div>
    </div>
  )
}

function TraceCopyRow({ activity, index }: { activity: TraceCopyActivity, index: number }) {
  return (
    <div className="ws-trace-copy-activity">
      <ArasaacPictogram
        alt={activity.picture.pictogramLabel || activity.word || `Trace and copy activity ${index + 1}`}
        className="ws-trace-copy-activity__picture"
        emptyMessage="Select an ARASAAC pictogram."
        failureMessage="ARASAAC image unavailable."
        id={activity.picture.pictogramId}
        imageClassName="ws-trace-copy-activity__image"
      />
      <div className="ws-trace-copy-activity__trace">
        <PrimaryWritingArea
          align="left"
          height={96}
          traceText={activity.word}
          traceVariant="dotted"
        />
      </div>
      <div className="ws-trace-copy-activity__copy">
        <PrimaryWritingArea align="left" height={96} />
      </div>
    </div>
  )
}

export function Worksheet({
  studentName,
  date,
  cvcActivities,
  traceCopyActivities,
}: WorksheetProps) {
  const calendar = buildCalendar(date)

  return (
    <div className="worksheet">

      {/* ── Section 1: Name ─────────────────────────────────────────── */}
      <section className="ws-section ws-section--name">
        <h2 className="ws-section__heading">
          <span className="ws-section__number">1</span> Trace your name.
        </h2>
        <div className="ws-name-writing-area">
          <PrimaryWritingArea traceName={studentName} height={96} />
        </div>
        <p className="ws-section__subheading">Copy your name.</p>
        <div className="ws-name-writing-area">
          <PrimaryWritingArea height={96} />
        </div>
      </section>

      {/* ── Section 2: Date ─────────────────────────────────────────── */}
      <section className="ws-section ws-section--date">
        <h2 className="ws-section__heading">
          <span className="ws-section__number">2</span> Trace the date.
        </h2>
        <div className="ws-date-writing-area">
          <PrimaryWritingArea
            height={96}
            traceText={calendar.monthDay}
          />
        </div>
        <p className="ws-section__subheading">Mark the date on the calendar.</p>
        <Calendar date={date} />
      </section>

      {/* ── Section 3: CVC circle ───────────────────────────────────── */}
      <section className="ws-section ws-section--cvc">
        <h2 className="ws-section__heading">
          <span className="ws-section__number">3</span> Look at each picture. Circle the correct CVC word.
        </h2>
        <div className="ws-cvc-row">
          {cvcActivities.map((activity, index) => (
            <CvcActivityCard key={`cvc-${index}-${activity.word}`} activity={activity} index={index} />
          ))}
        </div>
      </section>

      {/* ── Section 4: Trace-and-copy ───────────────────────────────── */}
      <section className="ws-section ws-section--trace-copy">
        <h2 className="ws-section__heading">
          <span className="ws-section__number">4</span> Trace each word. Then copy it on the line.
        </h2>
        <div className="ws-trace-copy-list">
          {traceCopyActivities.map((activity, index) => (
            <TraceCopyRow key={`trace-copy-${index}-${activity.word}`} activity={activity} index={index} />
          ))}
        </div>
      </section>

      <div className="worksheet__attribution">
        ARASAAC pictograms © ARASAAC (arasaac.org), CC BY-NC-SA.
      </div>
    </div>
  )
}
