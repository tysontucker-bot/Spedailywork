import { useState } from 'react'
import './App.css'
import { Worksheet } from './Worksheet'

function App() {
  const [studentName, setStudentName] = useState('')

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
      </div>
      <Worksheet studentName={studentName} />
    </div>
  )
}

export default App
