import type { Express } from "express";
import { WebSocketServer } from "ws";
import { setupWebRTCSignaling } from "./webrtc";

export function registerRoutes(app: Express) {
  const wss = new WebSocketServer({ noServer: true });
  setupWebRTCSignaling(wss);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Handle WebSocket upgrade
  app.on("upgrade", (request, socket, head) => {
    if (request.url === "/ws") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });
}
