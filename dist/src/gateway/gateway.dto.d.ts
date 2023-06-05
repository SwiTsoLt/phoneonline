export declare class JoinDto {
    roomCode: string;
}
type RtcDataType = 'description' | 'icecandidate';
export declare class RtcDataDto {
    type: RtcDataType;
    data: RTCSessionDescriptionInit | RTCIceCandidate;
}
export {};
