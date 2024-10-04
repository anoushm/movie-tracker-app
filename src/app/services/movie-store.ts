import { inject } from '@angular/core';
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
    chatResponse: null as ChatResponseModel | null,
    filter: {
        search: '' as string,
    }
}

export const MovieStore = signalStore(
    { providedIn: 'root' },
    withState(initialMovieState),
    withMethods(
        (store, movieService = inject(MovieService), chatService = inject(ChatService)) => ({
            async loadMovies(category: string,
                page: number = 1,
                sortBy = 'popularity.desc') {
                patchState(store, { loading: true });

                await movieService.getMovieList(category, page, sortBy);

                await movieService.movies$.subscribe({
                    next: (movies) => {
                        patchState(store, { movies, loading: false });
                    },
                    error: (error) => {
                        patchState(store, { error, loading: false });
                    }

                });
            },
            async loadGenres() {
                patchState(store, { loading: true });

                await movieService.getGenres().subscribe({
                    next: (genres: TmdbMovieGenreModel[]) => {
                        patchState(store, { genres, loading: false });
                    },
                    error: (error) => {
                        patchState(store, { error, loading: false });
                    }
                });
            },
            async loadMoviesByGenre(genre: TmdbMovieGenreModel['id'],
                page = 1,
                sortBy = 'popularity.desc'
            ) {
                patchState(store, { loading: true });

                await movieService.getMoviesByGenre(genre, page, sortBy);

                await movieService.movies$.subscribe({
                    next: (movies) => {
                        patchState(store, { movies, loading: false });
                    },
                    error: (error) => {
                        patchState(store, { error, loading: false });
                    }

                });
            },
            async searchMovies(search: string) {
                patchState(store, { filter: { search } });

                await movieService.searchMovies(search);

                await movieService.movies$.subscribe({
                    next: (movies) => {
                        patchState(store, { movies, loading: false });
                    },
                    error: (error) => {
                        patchState(store, { error, loading: false });
                    }
                });
            },
            async updateFavoriteMovies(movie: TmdbMovieModel) {
                await movieService.updateFavoriteMovies(movie);
            },
            async loadChatId() {
                patchState(store, { loading: true });

                await chatService.getChatId().subscribe({
                    next: (response: { chatId: string }) => {
                        patchState(store, { chatId: response.chatId, loading: false });
                    },
                    error: (error) => {
                        patchState(store, { error, loading: false });
                    }
                });
            },
            async sendChatMessage(chatMessage: string) {
                patchState(store, { loading: true });
                const chatId = store.chatId;

                await chatService.sendChatMessage(chatId() ?? '', chatMessage).subscribe({
                    next: (response: { chatResponse: ChatResponseModel }) => {
                        console.log('Chat response:', response.chatResponse);
                        patchState(store, { chatResponse: response.chatResponse, movies: [], loading: false });
                    },
                    error: (error) => {
                        patchState(store, { error, loading: false });
                    }
                });
            }
        }),
    ),
    withHooks({
        onInit: ({ loadChatId }) => {
            console.log('onInit');
            loadChatId();
        },
    }),
);

