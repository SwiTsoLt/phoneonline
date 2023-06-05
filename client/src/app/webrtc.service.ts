import { Injectable } from "@angular/core";
import { WebSocketService } from "./ws.service";

type IListenerType = 'icecandidate' | 'track'

@Injectable({
    providedIn: 'root',
})
export class WebRtcService {

    private pc: RTCPeerConnection | null = null;

    constructor(private ws: WebSocketService) {}

    public init() {
        const config: RTCConfiguration = {
            'iceServers': [
                {
                    'urls': ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302', 'stun:stun3.l.google.com:19302', 'stun:stun4.l.google.com:19302']
                }
            ]
        };

        this.pc = new RTCPeerConnection(config)
    }

    public setTrack(stream: MediaStream) {
        stream.getAudioTracks().forEach((track: MediaStreamTrack) => {
            if (this.pc) {
                this.pc.addTrack(track, stream)
            }
        })
    }

    public createOffer(): Promise<RTCSessionDescriptionInit> | null {
        if (this.pc) {
            return this.pc.createOffer()
        }
        return null
    }

    public createAnswer(): Promise<RTCSessionDescriptionInit> | null {
        if (this.pc) {
            return this.pc.createAnswer()
        }
        return null
    }

    public getLocalDescription(): RTCSessionDescriptionInit | null {
        if (this.pc) {
            return this.pc.localDescription
        }

        return null
    }

    public getRemoteDescription(): RTCSessionDescriptionInit | null {
        if (this.pc) {
            return this.pc.remoteDescription
        }

        return null
    }

    public setLocalDescription(description: RTCSessionDescriptionInit): Promise<void> {
        if (this.pc) {
            return this.pc.setLocalDescription(description)
        }
        return new Promise<void>((res) => res())
    }

    public setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
        if (this.pc) {
            return this.pc.setRemoteDescription(description)
        }
        return new Promise<void>((res) => res())
    }

    public addIceCandidate(candidate: RTCIceCandidate): void {
        if (this.pc) {
            this.pc.addIceCandidate(candidate)
        }
    }

    public listen(type: IListenerType, callback: Function): void {
        if (this.pc) {
            if (type === 'icecandidate') {
                this.pc.addEventListener('icecandidate', (event: RTCPeerConnectionIceEvent) => {
                    callback(event)
                })
                return;
            }

            if (type === 'track') {
                this.pc.addEventListener('track', (event: RTCTrackEvent) => {
                    callback(event)
                })
            }
        }
    }
}