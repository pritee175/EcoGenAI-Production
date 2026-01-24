"""
WebSocket connection manager for real-time updates
Broadcasts AI workload changes to connected dashboard clients
"""
from fastapi import WebSocket
from typing import List
import json

class ConnectionManager:
    """
    Manages WebSocket connections for real-time dashboard updates
    Broadcasts workload metrics every 5 seconds
    """
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        """Accept new WebSocket connection from dashboard"""
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Client connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        """Remove disconnected client"""
        self.active_connections.remove(websocket)
        print(f"Client disconnected. Total connections: {len(self.active_connections)}")
    
    async def broadcast(self, message: dict):
        """
        Send real-time updates to all connected clients
        Used by scheduler to push workload metrics
        """
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting to client: {e}")
                disconnected.append(connection)
        
        # Clean up dead connections
        for conn in disconnected:
            if conn in self.active_connections:
                self.active_connections.remove(conn)

# Global connection manager instance
manager = ConnectionManager()
