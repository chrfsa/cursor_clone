import { useState, useEffect, useRef, useCallback } from 'react'
import { type Message, type WebSocketMessage, type ChatRequest } from '../types'


export function useWebSocket(sessionId: string, onFileUpdate?: (content: string) => void) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Empêcher les connexions multiples
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    const connectWebSocket = () => {
      const ws = new WebSocket(`ws://localhost:8000/ws/chat/${sessionId}`)
      
      ws.onopen = () => {
        setIsConnected(true)
        console.log('WebSocket connected')
      }
      
      ws.onmessage = (event) => {
        const data: WebSocketMessage = JSON.parse(event.data)
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message
        }])
        
        if (data.file_content && onFileUpdate) {
          onFileUpdate(data.file_content)
        }
        
        setIsLoading(false)
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsLoading(false)
      }
      
      ws.onclose = () => {
        setIsConnected(false)
        console.log('WebSocket disconnected')
        
        // Réessayer de se connecter après 3 secondes
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...')
          connectWebSocket()
        }, 3000)
      }
      
      wsRef.current = ws
    }

    connectWebSocket()
    
    return () => {
      // Nettoyer proprement
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [sessionId]) // Ne se reconnecte que si sessionId change

  const sendMessage = useCallback((message: string, fileContent: string, filePath: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && !isLoading) {
      setMessages(prev => [...prev, { role: 'user', content: message }])
      setIsLoading(true)
      
      const request: ChatRequest = {
        message,
        file_content: fileContent,
        file_path: filePath
      }
      
      wsRef.current.send(JSON.stringify(request))
    }
  }, [isLoading])

  return { messages, sendMessage, isConnected, isLoading }
}
