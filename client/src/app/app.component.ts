import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebSocketService } from './ws.service';
import { WebRtcService } from './webrtc.service';
import { Observable, of } from 'rxjs';

// type IRtcDataType = 'description' | 'icecandidate'

// interface IRtcData {
//   type: IRtcDataType
//   data: RTCSessionDescriptionInit | RTCIceCandidate
// }

interface IErrorMessage {
  msg: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('audioPlayer') audioPlayer: ElementRef | null = null;

  // 80298268363
  public phone: string = ""
  public from: string = ""
  public errorMessage: string = ""
  public audioSrcObject: MediaStream | null = null

  private phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

  constructor(
    private ws: WebSocketService,
    private rtc: WebRtcService,
  ) { }

  ngOnInit(): void {
    this.askPhoneNumber()
    this.rtc.init()
    this.subscribe()
  }

  private askPhoneNumber(): void {
    const myNumber: string | null = prompt("Ваш номер телефона")

    if (!myNumber || !this.phoneRegex.test(myNumber)) {
      alert(`Номер '${myNumber || ''}' не валиден`)
      this.askPhoneNumber()
      return;
    }

    this.phone = myNumber
    this.ws.emit('create', { phone: this.phone })
    return;
  }

  public async call(phoneNumber: string) {
    if (!this.phoneRegex.test(phoneNumber)) {
      this.errorMessage = `Номер '${phoneNumber}' не валиден`
      return;
    }

    const stream: MediaStream | null = await this.getMedia()

    if (stream) {
      this.rtc.setTrack(stream)
    }

    const offer: RTCSessionDescriptionInit | null = await this.rtc.createOffer()

    if (offer) {
      await this.rtc.setLocalDescription(offer)
    }

    this.ws.emit('rtcData', { type: 'description', data: offer, from: this.phone, to: phoneNumber })
  }

  private subscribe() {
    this.ws.listen('message')
      .subscribe((error: IErrorMessage) => {
        this.errorMessage = error.msg
      })

    this.rtc.listen('icecandidate', (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        this.ws.emit('rtcData', { from: this.phone, to: this.from, type: 'icecandidate', data: event?.candidate })
      }
    })
    this.rtc.listen('track', (event: RTCTrackEvent) => {
      event.streams.forEach(stream => {
        if (this.audioPlayer) {
          this.audioPlayer.nativeElement.srcObject = stream
          this.audioPlayer.nativeElement.autoplay = true
          console.log('ready');
        }
      })
    })

    this.ws.listen("rtcData").subscribe(async (data: { from: string, data: any }) => {
      if (data.from) {
        this.from = data.from
      }

      switch (data.data.type) {
        case 'description':

          const acceptCallState =
            (this.rtc.getLocalDescription() || this.rtc.getRemoteDescription())
              ? true
              : confirm(`Звонок от ${data.from}. Принять?`)
          if (!acceptCallState) {
            return;
          }

          if (!this.rtc.getLocalDescription()) {
            const stream: MediaStream | null = await this.getMedia()

            if (stream) {
              this.rtc.setTrack(stream)
            }
          }

          await this.rtc.setRemoteDescription(data.data.data)

          if (this.rtc.getLocalDescription()) {
            return;
          }

          const answer: RTCSessionDescriptionInit | null = await this.rtc.createAnswer()

          if (!answer) {
            return;
          }

          await this.rtc.setLocalDescription(answer)
          this.ws.emit('rtcData', { from: this.phone, to: data.from, type: 'description', data: answer })

          break;

        case 'icecandidate':
          this.rtc.addIceCandidate(data.data.data)
          break;
      }
    })
  }

  private getMedia(): Promise<MediaStream> | null {
    if (navigator) {
      return navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: true,
          noiseSuppression: true
        }
      })
    }

    this.errorMessage = 'Нет доступа к медиа'
    return null
  }
}
