import { ElementRef, OnInit } from '@angular/core';
import { WebSocketService } from './ws.service';
import { WebRtcService } from './webrtc.service';
export declare class AppComponent implements OnInit {
    private ws;
    private rtc;
    audioPlayer: ElementRef | null;
    phone: string;
    from: string;
    errorMessage: string;
    audioSrcObject: MediaStream | null;
    private phoneRegex;
    constructor(ws: WebSocketService, rtc: WebRtcService);
    ngOnInit(): void;
    private askPhoneNumber;
    call(phoneNumber: string): Promise<void>;
    private subscribe;
    private getMedia;
}
