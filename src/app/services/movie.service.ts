import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay, of } from 'rxjs';
import { TmdbMovieGenreModel } from '../shared/models/tmdb-movie-genre.model';
import { environment } from '../../enviroments/enviroments';
import { TmdbMovieModel } from '../shared/models/tmdb-movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {
    private readonly http = inject(HttpClient);
    private readonly moviesSubject$ = new BehaviorSubject<TmdbMovieModel[]>([]);
    private readonly searchQuery$ = new BehaviorSubject<string>('');
    private favoriteMovies: TmdbMovieModel[] = [];

    public readonly movies$: Observable<TmdbMovieModel[]> = combineLatest([
        this.moviesSubject$.asObservable(),
        this.searchQuery$
    ]).pipe(
        map(([movies, searchQuery]) =>
            movies.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );

    public static readonly VALID_CATEGORIES = ['popular', 'top_rated', 'upcoming', 'now_playing', 'favorite'] as const;
    public static readonly validateCategory = (category: string): boolean => MovieService.VALID_CATEGORIES.includes(category as any);
    public static readonly validatePageNumber = (page: number): boolean => Number.isInteger(page) && page > 0;
    public static readonly validateGenreId = (id: number): boolean => Number.isInteger(id) && id > 0;

    private genres$?: Observable<TmdbMovieGenreModel[]>;
    getGenres(): Observable<TmdbMovieGenreModel[]> {
        if (!this.genres$) {
            this.genres$ = this.http
                .get<{ genres: TmdbMovieGenreModel[] }>(`${environment.themoviedbBaseUrl}/3/genre/movie/list`)
                .pipe(
                    map(({ genres }) => genres),
                    shareReplay({ bufferSize: 1, refCount: true })
                );
        }
        return this.genres$;
    }

    searchMovies(query: string): void {
        this.searchQuery$.next(query);
    }

    updateFavoriteMovies(movie: TmdbMovieModel): void {
        const isFavorite = this.favoriteMovies.find((m) => m.id === movie.id);
        if (!isFavorite) {
            this.favoriteMovies.push(movie);
        } else {
            this.favoriteMovies = this.favoriteMovies.filter((m) => m.id !== movie.id);
        }
    }

    getMoviesByGenre(genre: TmdbMovieGenreModel['id'], page = 1, sortBy = 'popularity.desc'): Observable<TmdbMovieModel[]> {
        if (!MovieService.validateGenreId(genre)) throw new Error('Invalid genre id');
        if (!MovieService.validatePageNumber(page)) throw new Error('Invalid page number');
        return this.http
            .get<{ results: TmdbMovieModel[] }>(
                `${environment.themoviedbBaseUrl}/3/discover/movie`,
                {
                    params: {
                        with_genres: genre,
                        page,
                        sort_by: sortBy,
                    },
                }
            )
            .pipe(map(({ results }) => this.updateFavorite(results)));
    }

    getMovieList(category: string, page: number = 1, sortBy = 'popularity.desc'): Observable<TmdbMovieModel[]> {
        if (!MovieService.validateCategory(category)) throw new Error('Invalid movie category');
        if (!MovieService.validatePageNumber(page)) throw new Error('Invalid page number');
        const { themoviedbBaseUrl: baseUrl } = environment;
        if (category === 'favorite') {
            return of(this.favoriteMovies);
        } else {
            return this.http
                .get<{ results: TmdbMovieModel[] }>(`${baseUrl}/3/movie/${category}`, {
                    params: { page, sort_by: sortBy },
                })
                .pipe(
                    map(({ results }) => this.updateFavorite(results)),
                    tap((movies) => this.moviesSubject$.next(movies))
                );
        }
    }

    private updateFavorite(movies: TmdbMovieModel[]): TmdbMovieModel[] {
        return movies.map((movie) => ({
            ...movie,
            favorite: this.favoriteMovies.some((m) => m.id === movie.id),
        }));
    }
}