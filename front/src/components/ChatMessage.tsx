import { type Message } from '../types'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <div style={{
      marginBottom: '15px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start'
    }}>
      <div style={{
        fontSize: '11px',
        color: '#666',
        marginBottom: '4px',
        fontWeight: '600',
        textTransform: 'uppercase'
      }}>
        {isUser ? 'You' : 'AI Assistant'}
      </div>
      <div style={{
        background: isUser ? '#0084ff' : '#fff',
        color: isUser ? '#fff' : '#000',
        padding: '10px 15px',
        borderRadius: '12px',
        maxWidth: '85%',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        fontSize: '14px',
        lineHeight: '1.5',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
      }}>
        {message.content}
      </div>
    </div>
  )
}
