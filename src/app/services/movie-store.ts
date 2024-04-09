import { inject } from '@angular/core';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
} from '@ngrx/signals';
import { MovieService } from './movie.service';
import { TmdbMovieGenreModel } from '../shared/models/tmdb-movie-genre.model';
import { TmdbMovieModel } from '../shared/models/tmdb-movie.model';

const initialMovieState = {
    movies: [] as TmdbMovieModel[],
    genres: [] as TmdbMovieGenreModel[],
    loading: false,
    error: null,
    filter: {
        search: '' as string,
    }
}

export const MovieStore = signalStore(
    { providedIn: 'root' },
    withState(initialMovieState),
    withMethods(
        (store, movieService = inject(MovieService)) => ({
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
            }
        }),
    ),
);

