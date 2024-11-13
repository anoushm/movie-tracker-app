import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { ChatResponseModel } from '../shared/models/chat-response.model';
import { ChatbotMovieModel } from '../shared/models/chatbot-movie.model';
import { TmdbMovieModel } from '../shared/models/tmdb-movie.model';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private http: HttpClient) { }

    public getChatId(): Observable<{ chatId: string }> {
        return this.http.get<{ chatId: string }>(`${environment.chatBaseUrl}/start`);
    }

    public sendChatMessage(chatId: string, message: string): Observable<{ messages: ChatResponseModel[] }> {
        return this.http.post<{ messages: ChatResponseModel[] }>(`${environment.chatBaseUrl}/${chatId}/ask`, { chatId, input: message })
            .pipe(
                map(response => this.mapResponse(response)),
            );
    }

    private mapResponse(response: any): { messages: ChatResponseModel[] } {
        return {
            messages: response.messages.map((chatResponse: any) => ({
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