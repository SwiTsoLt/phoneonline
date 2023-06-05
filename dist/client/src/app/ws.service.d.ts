import { Observable } from 'rxjs';
export declare class WebSocketService {
    private readonly uri;
    private socket;
    constructor();
    private getUri;
    listen(eventName: string): Observable<any>;
    emit(eventName: string, data: any): void;
    disconnect(): void;
    getSocketId(): string;
}
