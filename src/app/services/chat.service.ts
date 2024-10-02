import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private http: HttpClient) { }

    public getChatId(): Observable<{ chatId: string }> {
        return this.http.get<{ chatId: string }>(`${ environment.chatBaseUrl }/start`);
    }

    public sendChatMessage(chatId: string, message: string): Observable<{ chatResponse: string }> {
        return this.http.post<{ chatResponse: string }>(`${environment.chatBaseUrl }/dvNohnk/ask`, { chatId, message });
    }
}