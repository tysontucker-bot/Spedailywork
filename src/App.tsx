import { useState } from 'react'
import './App.css'
import { Worksheet } from './Worksheet'

function todayISO() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function App() {
  const [studentName, setStudentName] = useState('')
  const [date, setDate] = useState(todayISO)

  return (
    <div className="teacher-interface">
      <header className="teacher-interface__header">
        <h1>CVC Worksheet Generator</h1>
        <p>Use this tool to create daily worksheets for your students.</p>
      </header>
      <div className="teacher-interface__controls no-print">
        <label htmlFor="student-name-input">Student Name</label>
        <input
          id="student-name-input"
          type="text"
          value={studentName}
          onChange={e => setStudentName(e.target.value)}
        />
        <label htmlFor="date-input">Date</label>
        <input
          id="date-input"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <Worksheet studentName={studentName} date={date} />
    </div>
  )
}

export default App
