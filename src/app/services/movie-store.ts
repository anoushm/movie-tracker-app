import { inject } from '@angular/core';
import { take, catchError } from 'rxjs';
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
            loadMovies(category: string, page: number = 1, sortBy = 'popularity.desc'): void {
                patchState(store, { loading: true });
                movieService.getMovieList(category, page, sortBy)
                    .pipe(
                        take(1),
                        catchError(error => {
                            patchState(store, { error, loading: false });
                            throw error;
                        })
                    )
                    .subscribe((movies) => {
                        patchState(store, { movies, loading: false });
                    });
            },
            loadGenres(): void {
                patchState(store, { loading: true });
                movieService.getGenres()
                    .pipe(
                        take(1),
                        catchError(error => {
                            patchState(store, { error, loading: false });
                            throw error;
                        })
                    )
                    .subscribe((genres: TmdbMovieGenreModel[]) => {
                        patchState(store, { genres, loading: false });
                    });
            },
            loadMoviesByGenre(genre: TmdbMovieGenreModel['id'], page = 1, sortBy = 'popularity.desc'): void {
                patchState(store, { loading: true });
                movieService.getMoviesByGenre(genre, page, sortBy)
                    .pipe(
                        take(1),
                        catchError(error => {
                            patchState(store, { error, loading: false });
                            throw error;
                        })
                    )
                    .subscribe((movies) => {
                        patchState(store, { movies, loading: false });
                    });
            },
            searchMovies(search: string): void {
                patchState(store, { filter: { search } });
                movieService.searchMovies(search);
            },
            updateFavoriteMovies(movie: TmdbMovieModel): void {
                movieService.updateFavoriteMovies(movie);
            },
            loadChatId(): void {
                patchState(store, { loading: true });
                chatService.getChatId()
                    .pipe(
                        take(1),
                        catchError(error => {
                            patchState(store, { error, loading: false });
                            throw error;
                        })
                    )
                    .subscribe((response: { chatId: string }) => {
                        patchState(store, { chatId: response.chatId, loading: false });
                    });
            },
            sendChatMessage(chatMessage: string): void {
                patchState(store, { loading: true, funnyFact: null });
                const chatId = store.chatId;
                chatService
                    .sendChatMessage(chatId() ?? '', chatMessage)
                    .pipe(
                        take(1),
                        catchError(error => {
                            patchState(store, { error, loading: false });
                            throw error;
                        })
                    )
                    .subscribe((response: {
                        funnyFact?: string;
                        messages: ChatResponseModel[];
                    }) => {
                        const movies =
                            response.messages
                                .slice()
                                .reverse()
                                .find((m) => m.role === 'assistant')?.movieList ?? [];

                        patchState(store, {
                            funnyFact: response.funnyFact,
                            chatResponse: response.messages,
                            movies,
                            loading: false,
                        });
                    });
            }
        }),
    ),
    withHooks({
        onInit: ({ loadChatId }) => {
            loadChatId();
        },
    }),
);

