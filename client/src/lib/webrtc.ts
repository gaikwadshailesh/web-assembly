const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export async function initializeWebRTC(
  localStream: MediaStream,
  remoteVideo: HTMLVideoElement,
) {
  const pc = new RTCPeerConnection(configuration);
  const ws = new WebSocket(`wss://${window.location.host}/ws`);

  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  ws.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "offer") {
      await pc.setRemoteDescription(new RTCSessionDescription(message));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      ws.send(JSON.stringify(answer));
    } else if (message.type === "answer") {
      await pc.setRemoteDescription(new RTCSessionDescription(message));
    } else if (message.candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(message));
    }
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      ws.send(JSON.stringify(event.candidate));
    }
  };

  return pc;
}
