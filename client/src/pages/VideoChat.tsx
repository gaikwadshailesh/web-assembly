import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VideoControls } from "../components/video/VideoControls";
import { initializeWebRTC } from "../lib/webrtc";

export function VideoChat() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const rtcRef = useRef<RTCPeerConnection>();

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      rtcRef.current = await initializeWebRTC(stream, remoteVideoRef.current!);
    };

    init().catch(console.error);

    return () => {
      rtcRef.current?.close();
    };
  }, []);

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

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Video Chat</h2>

      <div className="grid gap-6 md:grid-cols-2">
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

        <Card className="overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full"
          />
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          variant={isConnected ? "destructive" : "default"}
          onClick={() => setIsConnected(!isConnected)}
        >
          {isConnected ? "End Call" : "Start Call"}
        </Button>
      </div>
    </div>
  );
}
