import { WebSocketService } from "./ws.service";
type IListenerType = 'icecandidate' | 'track';
export declare class WebRtcService {
    private ws;
    private pc;
    constructor(ws: WebSocketService);
    init(): void;
    setTrack(stream: MediaStream): void;
    createOffer(): Promise<RTCSessionDescriptionInit> | null;
    createAnswer(): Promise<RTCSessionDescriptionInit> | null;
    getLocalDescription(): RTCSessionDescriptionInit | null;
    getRemoteDescription(): RTCSessionDescriptionInit | null;
    setLocalDescription(description: RTCSessionDescriptionInit): Promise<void>;
    setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;
    addIceCandidate(candidate: RTCIceCandidate): void;
    listen(type: IListenerType, callback: Function): void;
}
export {};
