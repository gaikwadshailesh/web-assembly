import { WebSocketServer, WebSocket } from "ws";

interface Room {
  participants: Map<string, WebSocket>;
}

interface SignalingMessage {
  type: string;
  roomId?: string;
  userId?: string;
  targetUserId?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

export function setupWebRTCSignaling(wss: WebSocketServer) {
  const rooms = new Map<string, Room>();
  const userSocketMap = new Map<WebSocket, { roomId: string; userId: string }>();

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (data: string) => {
      const message: SignalingMessage = JSON.parse(data);

      switch (message.type) {
        case "join": {
          const roomId = message.roomId!;
          const userId = message.userId!;

          if (!rooms.has(roomId)) {
            rooms.set(roomId, { participants: new Map() });
          }

          const room = rooms.get(roomId)!;
          room.participants.set(userId, ws);
          userSocketMap.set(ws, { roomId, userId });

          // Notify other participants in the room
          room.participants.forEach((participant, participantId) => {
            if (participantId !== userId) {
              participant.send(JSON.stringify({
                type: "user-joined",
                userId: userId
              }));
              // Send existing participant info to the new user
              ws.send(JSON.stringify({
                type: "user-joined",
                userId: participantId
              }));
            }
          });
          break;
        }

        case "offer":
        case "answer":
        case "ice-candidate": {
          const userInfo = userSocketMap.get(ws);
          if (!userInfo) return;

          const room = rooms.get(userInfo.roomId);
          if (!room) return;

          const targetSocket = room.participants.get(message.targetUserId!);
          if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
            targetSocket.send(JSON.stringify({
              ...message,
              userId: userInfo.userId
            }));
          }
          break;
        }
      }
    });

    ws.on("close", () => {
      const userInfo = userSocketMap.get(ws);
      if (userInfo) {
        const { roomId, userId } = userInfo;
        const room = rooms.get(roomId);
        
        if (room) {
          room.participants.delete(userId);
          
          // Notify other participants about the user leaving
          room.participants.forEach((participant) => {
            participant.send(JSON.stringify({
              type: "user-left",
              userId: userId
            }));
          });

          // Clean up empty rooms
          if (room.participants.size === 0) {
            rooms.delete(roomId);
          }
        }
        
        userSocketMap.delete(ws);
      }
    });
  });
}
