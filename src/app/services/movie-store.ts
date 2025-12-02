import { inject } from '@angular/core';
import { take, catchError, Observable, tap } from 'rxjs';
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

interface MovieState {
    movies: TmdbMovieModel[];
    genres: TmdbMovieGenreModel[];
    loadingMovies: boolean;
    loadingGenres: boolean;
    loadingChat: boolean;
    errorMovies: unknown | null;
    errorGenres: unknown | null;
    errorChat: unknown | null;
    chatId: string | null;
    chatResponse: ChatResponseModel[] | null;
    filter: {
        search: string;
    };
    funnyFact: string | null;
}

const initialMovieState: MovieState = {
    movies: [],
    genres: [],
    loadingMovies: false,
    loadingGenres: false,
    loadingChat: false,
    errorMovies: null,
    errorGenres: null,
    errorChat: null,
    chatId: null,
    chatResponse: null,
    filter: {
        search: '',
    },
    funnyFact: null,
}

export const MovieStore = signalStore(
    { providedIn: 'root' },
    withState(initialMovieState),
    withMethods(
        (store, movieService = inject(MovieService), chatService = inject(ChatService)) => ({
            loadMovies(category: string, page: number = 1, sortBy = 'popularity.desc'): Observable<TmdbMovieModel[]> {
                patchState(store, { loadingMovies: true, errorMovies: null });
                return movieService.getMovieList(category, page, sortBy).pipe(
                    take(1),
                    tap(movies => patchState(store, { movies, loadingMovies: false })),
                    catchError(error => {
                        patchState(store, { errorMovies: error, loadingMovies: false });
                        throw error;
                    })
                );
            },
            loadGenres(): Observable<TmdbMovieGenreModel[]> {
                patchState(store, { loadingGenres: true, errorGenres: null });
                return movieService.getGenres().pipe(
                    take(1),
                    tap(genres => patchState(store, { genres, loadingGenres: false })),
                    catchError(error => {
                        patchState(store, { errorGenres: error, loadingGenres: false });
                        throw error;
                    })
                );
            },
            loadMoviesByGenre(genre: TmdbMovieGenreModel['id'], page = 1, sortBy = 'popularity.desc'): Observable<TmdbMovieModel[]> {
                patchState(store, { loadingMovies: true, errorMovies: null });
                return movieService.getMoviesByGenre(genre, page, sortBy).pipe(
                    take(1),
                    tap(movies => patchState(store, { movies, loadingMovies: false })),
                    catchError(error => {
                        patchState(store, { errorMovies: error, loadingMovies: false });
                        throw error;
                    })
                );
            },
            searchMovies(search: string): void {
                patchState(store, { filter: { search } });
                movieService.searchMovies(search);
                movieService.movies$.pipe(take(1)).subscribe(filteredMovies => {
                    patchState(store, { movies: filteredMovies });
                });
            },
            updateFavoriteMovies(movie: TmdbMovieModel): void {
                movieService.updateFavoriteMovies(movie);
            },
            loadChatId(): Observable<{ chatId: string }> {
                patchState(store, { loadingChat: true, errorChat: null });
                return chatService.getChatId().pipe(
                    take(1),
                    tap(response => patchState(store, { chatId: response.chatId, loadingChat: false })),
                    catchError(error => {
                        patchState(store, { errorChat: error, loadingChat: false });
                        throw error;
                    })
                );
            },
            sendChatMessage(chatMessage: string): Observable<{ funnyFact?: string; messages: ChatResponseModel[] }> {
                patchState(store, { loadingChat: true, errorChat: null, funnyFact: null });
                const chatId = store.chatId;
                return chatService.sendChatMessage(chatId() ?? '', chatMessage).pipe(
                    take(1),
                    tap(response => {
                        const moviesFromChat: TmdbMovieModel[] = response.messages
                            .filter(msg => msg.movieList && msg.movieList.length > 0)
                            .flatMap(msg => msg.movieList!);
                        
                        patchState(store, {
                            chatResponse: response.messages,
                            funnyFact: response.funnyFact ?? null,
                            movies: moviesFromChat.length > 0 ? moviesFromChat : store.movies(),
                            loadingChat: false
                        });
                    }),
                    catchError(error => {
                        patchState(store, { errorChat: error, loadingChat: false });
                        throw error;
                    })
                );
            }
        }),
    ),
    withHooks({
        onInit: ({ loadChatId }): void => {
            loadChatId().subscribe();
        },
    }),
);

