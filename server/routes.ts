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

  // Serve WebAssembly files
  app.get("/factorial.js", (_req, res) => {
    res.sendFile("factorial.js", { root: "./wasm" });
  });

  app.get("/factorial.wasm", (_req, res) => {
    res.sendFile("factorial.wasm", { root: "./wasm" });
  });

  return wss;
}
