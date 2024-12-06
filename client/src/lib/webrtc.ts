const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

interface PeerConnection {
  pc: RTCPeerConnection;
  videoElement: HTMLVideoElement;
}

export class WebRTCManager {
  private ws: WebSocket;
  private localStream: MediaStream;
  private peers: Map<string, PeerConnection> = new Map();
  private userId: string;
  private roomId: string;
  private onPeerJoinedCallback: (userId: string) => void;
  private onPeerLeftCallback: (userId: string) => void;

  constructor(
    localStream: MediaStream,
    roomId: string,
    onPeerJoined: (userId: string) => void,
    onPeerLeft: (userId: string) => void
  ) {
    this.localStream = localStream;
    this.roomId = roomId;
    this.userId = Math.random().toString(36).substr(2, 9);
    this.onPeerJoinedCallback = onPeerJoined;
    this.onPeerLeftCallback = onPeerLeft;
    this.ws = new WebSocket(`wss://${window.location.host}/ws`);
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        type: "join",
        roomId: this.roomId,
        userId: this.userId,
      }));
    };

    this.ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case "user-joined":
          this.handleUserJoined(message.userId);
          break;
        case "user-left":
          this.handleUserLeft(message.userId);
          break;
        case "offer":
          await this.handleOffer(message);
          break;
        case "answer":
          await this.handleAnswer(message);
          break;
        case "ice-candidate":
          await this.handleIceCandidate(message);
          break;
      }
    };
  }

  private async handleUserJoined(userId: string) {
    this.onPeerJoinedCallback(userId);
    const pc = new RTCPeerConnection(configuration);
    
    this.localStream.getTracks().forEach((track) => {
      pc.addTrack(track, this.localStream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.ws.send(JSON.stringify({
          type: "ice-candidate",
          candidate: event.candidate,
          targetUserId: userId,
        }));
      }
    };

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.ws.send(JSON.stringify({
      type: "offer",
      offer,
      targetUserId: userId,
    }));

    this.peers.set(userId, { 
      pc,
      videoElement: document.createElement('video')
    });
  }

  private handleUserLeft(userId: string) {
    const peer = this.peers.get(userId);
    if (peer) {
      peer.pc.close();
      this.peers.delete(userId);
      this.onPeerLeftCallback(userId);
    }
  }

  private async handleOffer(message: any) {
    const pc = new RTCPeerConnection(configuration);
    
    this.localStream.getTracks().forEach((track) => {
      pc.addTrack(track, this.localStream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.ws.send(JSON.stringify({
          type: "ice-candidate",
          candidate: event.candidate,
          targetUserId: message.userId,
        }));
      }
    };

    await pc.setRemoteDescription(new RTCSessionDescription(message.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    this.ws.send(JSON.stringify({
      type: "answer",
      answer,
      targetUserId: message.userId,
    }));

    this.peers.set(message.userId, {
      pc,
      videoElement: document.createElement('video')
    });
  }

  private async handleAnswer(message: any) {
    const peer = this.peers.get(message.userId);
    if (peer) {
      await peer.pc.setRemoteDescription(new RTCSessionDescription(message.answer));
    }
  }

  private async handleIceCandidate(message: any) {
    const peer = this.peers.get(message.userId);
    if (peer) {
      await peer.pc.addIceCandidate(new RTCIceCandidate(message.candidate));
    }
  }

  public setVideoElement(userId: string, videoElement: HTMLVideoElement) {
    const peer = this.peers.get(userId);
    if (peer) {
      peer.videoElement = videoElement;
      peer.pc.ontrack = (event) => {
        videoElement.srcObject = event.streams[0];
      };
    }
  }

  public cleanup() {
    this.peers.forEach((peer) => {
      peer.pc.close();
    });
    this.peers.clear();
    this.ws.close();
  }
}
