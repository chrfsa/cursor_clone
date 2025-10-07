export interface Message {
    role: 'user' | 'assistant'
    content: string
  }
  
export interface WebSocketMessage {
message: string
file_content?: string
file_path?: string
}

export interface ChatRequest {
message: string
file_content: string
file_path: string
}
  