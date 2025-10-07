# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json
from AIAgent import AIAgent
import os

app = FastAPI()

# CORS pour permettre React de communiquer
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Port par défaut de Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    file_content: str  # Le contenu actuel du fichier dans l'éditeur
    file_path: str


# Instance globale (ou mieux: gérer par session)
agents: Dict[str, AIAgent] = {}

@app.websocket("/ws/chat/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    await websocket.accept()
    
    # Créer un agent pour cette session
    if session_id not in agents:
        api_key = os.environ.get("OPENROUTER_API_KEY")
        agents[session_id] = AIAgent(api_key)
    
    agent = agents[session_id]
    
    try:
        while True:
            # Recevoir le message du client
            data = await websocket.receive_json()
            user_message = data.get("message")
            file_content = data.get("file_content", "")
            file_path = data.get("file_path", "untitled.py")
            
            # Sauvegarder temporairement le fichier pour que l'agent puisse le lire
            if file_content:
                with open(file_path, "w") as f:
                    f.write(file_content)
            
            # Obtenir la réponse de l'agent
            response = agent.chat(user_message)
            
            # Lire le fichier modifié (si l'agent l'a changé)
            try:
                with open(file_path, "r") as f:
                    updated_content = f.read()
            except:
                updated_content = file_content
            
            # Envoyer la réponse au client
            await websocket.send_json({
                "message": response,
                "file_content": updated_content,
                "file_path": file_path
            })
            
    except WebSocketDisconnect:
        # Nettoyer la session
        if session_id in agents:
            del agents[session_id]

@app.get("/")
async def root():
    return {"message": "Cursor Clone API"}