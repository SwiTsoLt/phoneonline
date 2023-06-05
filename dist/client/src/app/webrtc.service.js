"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebRtcService = void 0;
const core_1 = require("@angular/core");
const ws_service_1 = require("./ws.service");
let WebRtcService = class WebRtcService {
    constructor(ws) {
        this.ws = ws;
        this.pc = null;
    }
    init() {
        const config = {
            'iceServers': [
                {
                    'urls': ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302', 'stun:stun3.l.google.com:19302', 'stun:stun4.l.google.com:19302']
                }
            ]
        };
        this.pc = new RTCPeerConnection(config);
    }
    setTrack(stream) {
        stream.getAudioTracks().forEach((track) => {
            if (this.pc) {
                this.pc.addTrack(track, stream);
            }
        });
    }
    createOffer() {
        if (this.pc) {
            return this.pc.createOffer();
        }
        return null;
    }
    createAnswer() {
        if (this.pc) {
            return this.pc.createAnswer();
        }
        return null;
    }
    getLocalDescription() {
        if (this.pc) {
            return this.pc.localDescription;
        }
        return null;
    }
    getRemoteDescription() {
        if (this.pc) {
            return this.pc.remoteDescription;
        }
        return null;
    }
    setLocalDescription(description) {
        if (this.pc) {
            return this.pc.setLocalDescription(description);
        }
        return new Promise((res) => res());
    }
    setRemoteDescription(description) {
        if (this.pc) {
            return this.pc.setRemoteDescription(description);
        }
        return new Promise((res) => res());
    }
    addIceCandidate(candidate) {
        if (this.pc) {
            this.pc.addIceCandidate(candidate);
        }
    }
    listen(type, callback) {
        if (this.pc) {
            if (type === 'icecandidate') {
                this.pc.addEventListener('icecandidate', (event) => {
                    callback(event);
                });
                return;
            }
            if (type === 'track') {
                this.pc.addEventListener('track', (event) => {
                    callback(event);
                });
            }
        }
    }
};
WebRtcService = __decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [ws_service_1.WebSocketService])
], WebRtcService);
exports.WebRtcService = WebRtcService;
//# sourceMappingURL=webrtc.service.js.map