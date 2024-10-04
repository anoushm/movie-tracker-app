import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { ChatResponseModel } from '../shared/models/chat-response.model';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private http: HttpClient) { }

    public getChatId(): Observable<{ chatId: string }> {
        return this.http.get<{ chatId: string }>(`${ environment.chatBaseUrl }/start`);
    }

    public sendChatMessage(chatId: string, message: string): Observable<{ chatResponse: ChatResponseModel }> {
        return this.http.post<{ chatResponse: ChatResponseModel }>(`${environment.chatBaseUrl }/${chatId}/ask`, { chatId, input: message });
    }
}