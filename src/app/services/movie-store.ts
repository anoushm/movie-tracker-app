import { inject } from '@angular/core';
import { take, catchError, Observable } from 'rxjs';
import {
    patchState,
    signalStore,
    withHooks,
    withMethods,
    withState,
} from '@ngrx/signals';
import { MovieService } from './movie.service';
import { TmdbMovieGenreModel } from '../shared/models/tmdb-movie-genre.model';
import { TmdbMovieModel } from '../shared/models/tmdb-movie.model';
import { ChatService } from './chat.service';
import { ChatResponseModel } from '../shared/models/chat-response.model';


const initialMovieState = {
    movies: [] as TmdbMovieModel[],
    genres: [] as TmdbMovieGenreModel[],
    loading: false,
    error: null,
    chatId: null as string | null,
    chatResponse: null as ChatResponseModel[] | null,
    filter: {
        search: '' as string,
    },
    funnyFact: null as string | null,
}

export const MovieStore = signalStore(
    { providedIn: 'root' },
    withState(initialMovieState),
    withMethods(
        (store, movieService = inject(MovieService), chatService = inject(ChatService)) => ({
            loadMovies(category: string, page: number = 1, sortBy = 'popularity.desc'): Observable<TmdbMovieModel[]> {
                patchState(store, { loading: true });
                return movieService.getMovieList(category, page, sortBy).pipe(
                    take(1),
                    catchError(error => {
                        patchState(store, { error, loading: false });
                        throw error;
                    })
                );
            },
            loadGenres(): Observable<TmdbMovieGenreModel[]> {
                patchState(store, { loading: true });
                return movieService.getGenres().pipe(
                    take(1),
                    catchError(error => {
                        patchState(store, { error, loading: false });
                        throw error;
                    })
                );
            },
            loadMoviesByGenre(genre: TmdbMovieGenreModel['id'], page = 1, sortBy = 'popularity.desc'): Observable<TmdbMovieModel[]> {
                patchState(store, { loading: true });
                return movieService.getMoviesByGenre(genre, page, sortBy).pipe(
                    take(1),
                    catchError(error => {
                        patchState(store, { error, loading: false });
                        throw error;
                    })
                );
            },
            searchMovies(search: string): void {
                patchState(store, { filter: { search } });
                movieService.searchMovies(search);
            },
            updateFavoriteMovies(movie: TmdbMovieModel): void {
                movieService.updateFavoriteMovies(movie);
            },
            loadChatId(): Observable<{ chatId: string }> {
                patchState(store, { loading: true });
                return chatService.getChatId().pipe(
                    take(1),
                    catchError(error => {
                        patchState(store, { error, loading: false });
                        throw error;
                    })
                );
            },
            sendChatMessage(chatMessage: string): Observable<{ funnyFact?: string; messages: ChatResponseModel[] }> {
                patchState(store, { loading: true, funnyFact: null });
                const chatId = store.chatId;
                return chatService.sendChatMessage(chatId() ?? '', chatMessage).pipe(
                    take(1),
                    catchError(error => {
                        patchState(store, { error, loading: false });
                        throw error;
                    })
                );
            }
        }),
    ),
    withHooks({
        onInit: ({ loadChatId }) => {
            loadChatId();
        },
    }),
);

