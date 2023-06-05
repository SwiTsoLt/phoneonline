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
exports.AppComponent = void 0;
const core_1 = require("@angular/core");
const ws_service_1 = require("./ws.service");
const webrtc_service_1 = require("./webrtc.service");
let AppComponent = class AppComponent {
    constructor(ws, rtc) {
        this.ws = ws;
        this.rtc = rtc;
        this.audioPlayer = null;
        this.phone = "";
        this.from = "";
        this.errorMessage = "";
        this.audioSrcObject = null;
        this.phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    }
    ngOnInit() {
        this.askPhoneNumber();
        this.rtc.init();
        this.subscribe();
    }
    askPhoneNumber() {
        const myNumber = prompt("Ваш номер телефона");
        if (!myNumber || !this.phoneRegex.test(myNumber)) {
            alert(`Номер '${myNumber || ''}' не валиден`);
            this.askPhoneNumber();
            return;
        }
        this.phone = myNumber;
        this.ws.emit('create', { phone: this.phone });
        return;
    }
    async call(phoneNumber) {
        if (!this.phoneRegex.test(phoneNumber)) {
            this.errorMessage = `Номер '${phoneNumber}' не валиден`;
            return;
        }
        const stream = await this.getMedia();
        if (stream) {
            this.rtc.setTrack(stream);
        }
        const offer = await this.rtc.createOffer();
        if (offer) {
            await this.rtc.setLocalDescription(offer);
        }
        this.ws.emit('rtcData', { type: 'description', data: offer, from: this.phone, to: phoneNumber });
    }
    subscribe() {
        this.ws.listen('message')
            .subscribe((error) => {
            this.errorMessage = error.msg;
        });
        this.rtc.listen('icecandidate', (event) => {
            if (event.candidate) {
                this.ws.emit('rtcData', { from: this.phone, to: this.from, type: 'icecandidate', data: event === null || event === void 0 ? void 0 : event.candidate });
            }
        });
        this.rtc.listen('track', (event) => {
            event.streams.forEach(stream => {
                if (this.audioPlayer) {
                    this.audioPlayer.nativeElement.srcObject = stream;
                    this.audioPlayer.nativeElement.autoplay = true;
                    console.log('ready');
                }
            });
        });
        this.ws.listen("rtcData").subscribe(async (data) => {
            if (data.from) {
                this.from = data.from;
            }
            switch (data.data.type) {
                case 'description':
                    const acceptCallState = (this.rtc.getLocalDescription() || this.rtc.getRemoteDescription())
                        ? true
                        : confirm(`Звонок от ${data.from}. Принять?`);
                    if (!acceptCallState) {
                        return;
                    }
                    if (!this.rtc.getLocalDescription()) {
                        const stream = await this.getMedia();
                        if (stream) {
                            this.rtc.setTrack(stream);
                        }
                    }
                    await this.rtc.setRemoteDescription(data.data.data);
                    if (this.rtc.getLocalDescription()) {
                        return;
                    }
                    const answer = await this.rtc.createAnswer();
                    if (!answer) {
                        return;
                    }
                    await this.rtc.setLocalDescription(answer);
                    this.ws.emit('rtcData', { from: this.phone, to: data.from, type: 'description', data: answer });
                    break;
                case 'icecandidate':
                    this.rtc.addIceCandidate(data.data.data);
                    break;
            }
        });
    }
    getMedia() {
        if (navigator) {
            return navigator.mediaDevices.getUserMedia({
                audio: {
                    autoGainControl: true,
                    noiseSuppression: true
                }
            });
        }
        this.errorMessage = 'Нет доступа к медиа';
        return null;
    }
};
__decorate([
    (0, core_1.ViewChild)('audioPlayer'),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "audioPlayer", void 0);
AppComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    }),
    __metadata("design:paramtypes", [ws_service_1.WebSocketService,
        webrtc_service_1.WebRtcService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map