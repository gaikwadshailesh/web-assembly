import type { WebSocketServer, WebSocket } from "ws";

export function setupWebRTCSignaling(wss: WebSocketServer) {
  const clients = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    clients.add(ws);

    ws.on("message", (message) => {
      // Broadcast the message to all other clients
      for (const client of clients) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
    });
  });
}
