import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
    error: null as string | null,
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
            async loadMovies(category: string,
                page: number = 1,
                sortBy = 'popularity.desc'): Promise<void> {
                patchState(store, { loading: true });

                movieService.getMovieList(category, page, sortBy);

                try {
                    const movies = await firstValueFrom(movieService.movies$);
                    patchState(store, { movies, loading: false });
                } catch (error) {
                    patchState(store, { error: String(error), loading: false });
                }
            },
            async loadGenres(): Promise<void> {
                patchState(store, { loading: true });

                try {
                    const genres = await firstValueFrom(movieService.getGenres());
                    patchState(store, { genres, loading: false });
                } catch (error) {
                    patchState(store, { error: String(error), loading: false });
                }
            },
            async loadMoviesByGenre(genre: TmdbMovieGenreModel['id'],
                page = 1,
                sortBy = 'popularity.desc'
            ): Promise<void> {
                patchState(store, { loading: true });

                movieService.getMoviesByGenre(genre, page, sortBy);

                try {
                    const movies = await firstValueFrom(movieService.movies$);
                    patchState(store, { movies, loading: false });
                } catch (error) {
                    patchState(store, { error: String(error), loading: false });
                }
            },
            async searchMovies(search: string): Promise<void> {
                patchState(store, { filter: { search } });

                movieService.searchMovies(search);

                try {
                    const movies = await firstValueFrom(movieService.movies$);
                    patchState(store, { movies, loading: false });
                } catch (error) {
                    patchState(store, { error: String(error), loading: false });
                }
            },
            async updateFavoriteMovies(movie: TmdbMovieModel): Promise<void> {
                await movieService.updateFavoriteMovies(movie);
            },
            async loadChatId(): Promise<void> {
                patchState(store, { loading: true });

                try {
                    const response = await firstValueFrom(chatService.getChatId());
                    patchState(store, { chatId: response.chatId, loading: false });
                } catch (error) {
                    patchState(store, { error: String(error), loading: false });
                }
            },
            async sendChatMessage(chatMessage: string): Promise<void> {
                patchState(store, { loading: true, funnyFact: null });
                const chatId = store.chatId;

                try {
                    const response = await firstValueFrom(
                        chatService.sendChatMessage(chatId() ?? '', chatMessage),
                    );

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
                } catch (error) {
                    patchState(store, { error: String(error), loading: false });
                }
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

