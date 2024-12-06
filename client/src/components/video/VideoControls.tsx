import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface VideoControlsProps {
  isMuted: boolean;
  isVideoEnabled: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export function VideoControls({
  isMuted,
  isVideoEnabled,
  onToggleMute,
  onToggleVideo,
}: VideoControlsProps) {
  return (
    <div className="flex justify-center gap-4 p-4 bg-muted">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleMute}
        className={isMuted ? "bg-red-100" : ""}
      >
        {isMuted ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleVideo}
        className={!isVideoEnabled ? "bg-red-100" : ""}
      >
        {isVideoEnabled ? (
          <Video className="h-4 w-4" />
        ) : (
          <VideoOff className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
