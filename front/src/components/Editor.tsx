import Editor from '@monaco-editor/react'

interface EditorProps {
  code: string
  setCode: (code: string) => void
  filePath: string
  setFilePath: (path: string) => void
}

export default function CodeEditor({ code, setCode, filePath, setFilePath }: EditorProps) {
  const getLanguage = (path: string) => {
    if (path.endsWith('.py')) return 'python'
    if (path.endsWith('.js') || path.endsWith('.jsx')) return 'javascript'
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript'
    if (path.endsWith('.html')) return 'html'
    if (path.endsWith('.css')) return 'css'
    if (path.endsWith('.json')) return 'json'
    return 'plaintext'
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header avec le nom du fichier */}
      <div style={{ 
        padding: '10px 15px', 
        background: '#1e1e1e', 
        color: '#cccccc',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '13px', fontFamily: 'monospace' }}>
          📄 {filePath}
        </span>
        <input
          type="text"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          style={{
            background: '#2d2d2d',
            border: '1px solid #3e3e3e',
            color: '#cccccc',
            padding: '4px 8px',
            borderRadius: '3px',
            fontSize: '12px',
            fontFamily: 'monospace',
            marginLeft: 'auto',
            width: '200px'
          }}
          placeholder="filename.py"
        />
      </div>

      {/* Monaco Editor */}
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          language={getLanguage(filePath)}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            padding: { top: 10 }
          }}
        />
      </div>
    </div>
  )
}