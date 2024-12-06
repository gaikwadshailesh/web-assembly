import { WebSocketServer, WebSocket } from "ws";

export function setupWebRTCSignaling(wss: WebSocketServer) {
  const clients = new Set<WebSocket>();

  wss.on("connection", (ws: WebSocket) => {
    clients.add(ws);

    ws.on("message", (message) => {
      // Broadcast the message to all other clients
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    });

    ws.on("close", () => {
      clients.delete(ws);
    });
  });
}
