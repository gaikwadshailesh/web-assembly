import type { Express } from "express";
import { WebSocketServer } from "ws";
import type { IncomingMessage } from "http";
import type { Socket } from "net";
import { setupWebRTCSignaling } from "./webrtc";

export function registerRoutes(app: Express) {
  const wss = new WebSocketServer({ noServer: true });
  setupWebRTCSignaling(wss);

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return wss;
}
