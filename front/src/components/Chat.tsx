import { useState, useRef, useEffect } from 'react'
import { useWebSocket } from '../hooks/useWebSocket'
import ChatMessage from './ChatMessage'
import { getSessionId } from '../utils/session'

interface ChatProps {
  code: string
  setCode: (code: string) => void
  filePath: string
}

export default function Chat({ code, setCode, filePath }: ChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Utilise le même session ID pour toute la durée de vie de l'app
  const sessionId = useRef(getSessionId()).current
  
  const { messages, sendMessage, isConnected, isLoading } = useWebSocket(
    sessionId,
    (newContent) => setCode(newContent)
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input, code, filePath)
      setInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: '#f8f9fa'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '15px 20px', 
        background: '#fff', 
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontWeight: '600', fontSize: '15px' }}>
          🤖 AI Assistant
        </span>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isConnected ? '#4caf50' : '#f44336',
          marginLeft: 'auto'
        }} />
        <span style={{ fontSize: '12px', color: '#666' }}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
        <span style={{ fontSize: '10px', color: '#999', fontFamily: 'monospace' }}>
          {sessionId}
        </span>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: '#999',
            marginTop: '40px',
            fontSize: '14px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>💬</div>
            Start chatting with the AI to modify your code!
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
        
        {isLoading && (
          <div style={{
            display: 'flex',
            gap: '5px',
            padding: '10px',
            alignItems: 'center'
          }}>
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ 
        padding: '15px 20px', 
        background: '#fff', 
        borderTop: '1px solid #e0e0e0' 
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask the AI to modify your code..."
            disabled={!isConnected || isLoading}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'none',
              fontFamily: 'inherit',
              minHeight: '44px',
              maxHeight: '120px'
            }}
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !isConnected || isLoading}
            style={{
              padding: '0 20px',
              background: isConnected && input.trim() && !isLoading ? '#0084ff' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: isConnected && input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background 0.2s'
            }}
          >
            Send
          </button>
        </div>
        <div style={{ 
          fontSize: '11px', 
          color: '#999', 
          marginTop: '8px' 
        }}>
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}