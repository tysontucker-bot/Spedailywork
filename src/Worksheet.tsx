import './Worksheet.css'

interface WorksheetProps {
  studentName: string
}

export function Worksheet({ studentName }: WorksheetProps) {
  return (
    <div className="worksheet">

      {/* ── Section 1: Name ─────────────────────────────────────────── */}
      <section className="ws-section ws-section--name">
        <h2 className="ws-section__heading">
          <span className="ws-section__number">1</span> Trace your name.
        </h2>
        <div className="ws-name-reserved ws-name-reserved--trace">{studentName}</div>
        <p className="ws-section__subheading">Copy your name.</p>
        <div className="ws-name-reserved ws-name-reserved--copy" />
      </section>

      {/* ── Section 2: Date ─────────────────────────────────────────── */}
      <section className="ws-section ws-section--date">
        <h2 className="ws-section__heading">
          <span className="ws-section__number">2</span> Trace the date.
        </h2>
        <div className="ws-date-reserved ws-date-reserved--trace" />
        <p className="ws-section__subheading">Mark the date on the calendar.</p>
        <div className="ws-date-reserved ws-date-reserved--calendar" />
      </section>

      {/* ── Section 3: CVC circle ───────────────────────────────────── */}
      <section className="ws-section ws-section--cvc">
        <h2 className="ws-section__heading">
          <span className="ws-section__number">3</span> Look at each picture. Circle the correct CVC word.
        </h2>
        <div className="ws-cvc-row">
          <div className="ws-cvc-activity" />
          <div className="ws-cvc-activity" />
          <div className="ws-cvc-activity" />
        </div>
      </section>

      {/* ── Section 4: Trace-and-copy ───────────────────────────────── */}
      <section className="ws-section ws-section--trace-copy">
        <h2 className="ws-section__heading">
          <span className="ws-section__number">4</span> Trace each word. Then copy it on the line.
        </h2>
        <div className="ws-trace-copy-list">
          <div className="ws-trace-copy-activity" />
          <div className="ws-trace-copy-activity" />
          <div className="ws-trace-copy-activity" />
        </div>
      </section>

    </div>
  )
}
