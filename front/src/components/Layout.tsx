import { useState } from 'react'
import Editor from './Editor'
import Chat from './Chat'

function App() {
  const [code, setCode] = useState('# Écris ton code ici\n')
  const [filePath, setFilePath] = useState('main.py')

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Éditeur à gauche - 60% */}
      <div style={{ width: '60%', borderRight: '1px solid #ccc' }}>
        <Editor 
          code={code} 
          setCode={setCode}
          filePath={filePath}
          setFilePath={setFilePath}
        />
      </div>
      
      {/* Chat à droite - 40% */}
      <div style={{ width: '40%' }}>
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
