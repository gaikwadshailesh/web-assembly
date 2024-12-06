import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VideoControls } from "../components/video/VideoControls";
import { WebRTCManager } from "../lib/webrtc";
import { useToast } from "@/hooks/use-toast";

export function VideoChat() {
  const [roomId, setRoomId] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [peers, setPeers] = useState<string[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const webrtcManagerRef = useRef<WebRTCManager>();
  const { toast } = useToast();

  const initializeStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access camera and microphone",
        variant: "destructive",
      });
      throw error;
    }
  };

  const joinRoom = async () => {
    if (!roomId) {
      toast({
        title: "Error",
        description: "Please enter a room ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await initializeStream();
      webrtcManagerRef.current = new WebRTCManager(
        stream,
        roomId,
        (userId) => {
          setPeers((prev) => [...prev, userId]);
          // Create video element for new peer
          const videoElement = document.createElement("video");
          videoElement.autoplay = true;
          videoElement.playsInline = true;
          peerVideosRef.current.set(userId, videoElement);
          webrtcManagerRef.current?.setVideoElement(userId, videoElement);
        },
        (userId) => {
          setPeers((prev) => prev.filter((id) => id !== userId));
          peerVideosRef.current.delete(userId);
        }
      );
      setIsInRoom(true);
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  const leaveRoom = () => {
    webrtcManagerRef.current?.cleanup();
    setIsInRoom(false);
    setPeers([]);
    peerVideosRef.current.clear();
  };

  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsVideoEnabled(!isVideoEnabled);
  };

  useEffect(() => {
    return () => {
      webrtcManagerRef.current?.cleanup();
    };
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Video Chat</h2>

      {!isInRoom ? (
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={joinRoom}>Join Room</Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full"
              />
              <VideoControls
                isMuted={isMuted}
                isVideoEnabled={isVideoEnabled}
                onToggleMute={toggleMute}
                onToggleVideo={toggleVideo}
              />
            </Card>

            {peers.map((peerId) => (
              <Card key={peerId} className="overflow-hidden">
                <video
                  ref={(el) => {
                    if (el) {
                      peerVideosRef.current.set(peerId, el);
                      webrtcManagerRef.current?.setVideoElement(peerId, el);
                    }
                  }}
                  autoPlay
                  playsInline
                  className="w-full"
                />
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              variant="destructive"
              onClick={leaveRoom}
            >
              Leave Room
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
