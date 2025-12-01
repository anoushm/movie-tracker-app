import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { ChatResponseModel } from '../shared/models/chat-response.model';
import { ChatbotMovieModel } from '../shared/models/chatbot-movie.model';
import { TmdbMovieModel } from '../shared/models/tmdb-movie.model';

interface ChatApiResponse {
    funnyFact?: string;
    messages: Array<{
        role: 'user' | 'assistant';
        text: string;
        movieList?: ChatbotMovieModel[] | null;
    }>;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private http = inject(HttpClient);

    public getChatId(): Observable<{ chatId: string }> {
        return this.http.get<{ chatId: string }>(`${environment.chatBaseUrl}/start`);
    }

    public sendChatMessage(chatId: string, message: string): Observable<{ funnyFact?: string; messages: ChatResponseModel[] }> {
        const trimmedChatId = chatId.trim();
        const trimmedMessage = message.trim();
        if (!trimmedChatId || !trimmedMessage) {
            throw new Error('chatId and message are required');
        }
        return this.http.post<ChatApiResponse>(`${environment.chatBaseUrl}/${trimmedChatId}/ask`, { chatId: trimmedChatId, input: trimmedMessage })
            .pipe(
                map(response => this.mapResponse(response)),
            );
    }

    private mapResponse(response: ChatApiResponse): { funnyFact?: string; messages: ChatResponseModel[] } {
        return {
            funnyFact: response.funnyFact,
            messages: response.messages.map((chatResponse) => ({
                role: chatResponse.role,
                text: chatResponse.text,
                movieList: chatResponse.movieList?.map(this.mapMovie) ?? null
            }))
        };
    }

    private mapMovie(movie: ChatbotMovieModel): TmdbMovieModel {
        return {
            poster_path: movie.posterPath,
            adult: movie.adult,
            overview: movie.overview,
            release_date: movie.releaseDate,
            genre_ids: movie.genreIds,
            id: movie.id,
            original_title: movie.originalTitle,
            original_language: movie.originalLanguage,
            title: movie.title,
            backdrop_path: movie.backdropPath || '',
            popularity: movie.popularity,
            vote_count: movie.voteCount,
            video: movie.video,
            vote_average: movie.voteAverage,
            favorite: movie.favorite
        };
    }
}