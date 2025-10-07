// Génère un ID de session unique et le garde en mémoire
let sessionId: string | null = null

export function getSessionId(): string {
  if (!sessionId) {
    sessionId = 'session-' + Math.random().toString(36).substr(2, 9)
  }
  return sessionId
}