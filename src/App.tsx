import './App.css'
import { Worksheet } from './Worksheet'

function App() {
  return (
    <div className="teacher-interface">
      <header className="teacher-interface__header">
        <h1>CVC Worksheet Generator</h1>
        <p>Use this tool to create daily worksheets for your students.</p>
      </header>
      <Worksheet />
    </div>
  )
}

export default App
