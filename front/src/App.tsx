import { useState } from 'react'
import Editor from './components/Editor'
import Chat from './components/Chat'
import './App.css'

function App() {
  const [code, setCode] = useState('# Write your code here\nprint("Hello, World!")\n')
  const [filePath, setFilePath] = useState('main.py')

  return (
    <div className="app-container">
      {/* Éditeur à gauche */}
      <div className="editor-panel">
        <Editor 
          code={code} 
          setCode={setCode}
          filePath={filePath}
          setFilePath={setFilePath}
        />
      </div>
      
      {/* Chat à droite */}
      <div className="chat-panel">
        <Chat 
          code={code}
          setCode={setCode}
          filePath={filePath}
        />
      </div>
    </div>
  )
}

export default App
