from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
import orjson
import logging
from typing import List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Aurelius Yield Engine", version="2.4.0")

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: bytes):
        for connection in self.active_connections:
            try:
                await connection.send_bytes(message)
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws/v1/yield")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            loop_time = asyncio.get_event_loop().time()
            payload = {
                "stream": "yield_aggregate",
                "data": {
                    "apy_bps": 684 + int(loop_time % 10),
                    "tvl_usd": 142500000 + int(loop_time % 50000),
                    "timestamp": int(loop_time * 1000)
                }
            }
            await manager.broadcast(orjson.dumps(payload))
            await asyncio.sleep(0.250)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
