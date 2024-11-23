import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { TmdbMovieGenreModel } from '../shared/models/tmdb-movie-genre.model';
import { environment } from '../../enviroments/enviroments';
import { TmdbMovieModel } from '../shared/models/tmdb-movie.model';

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private moviesSubject$ = new BehaviorSubject<TmdbMovieModel[]>([]);
    private searchQuery$ = new BehaviorSubject<string>('');
    private favoriteMovies: TmdbMovieModel[] = [];
    public movies$ = combineLatest([
        this.moviesSubject$.asObservable(),
        this.searchQuery$])
        .pipe(
            map(([movies, searchQuery]) =>
                movies.filter(p => p.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1))
        );

    constructor(private httpClient: HttpClient) { }

    public getGenres(): Observable<TmdbMovieGenreModel[]> {
        return this.httpClient
            .get<{
                genres: TmdbMovieGenreModel[];
            }>(`${environment.themoviedbBaseUrl}/3/genre/movie/list`)
            .pipe(map(({ genres }) => genres));
    }

    public searchMovies(query: string): void {
        this.searchQuery$.next(query);
    }

    public updateFavoriteMovies(movie: TmdbMovieModel): void {
        const isFavorite = this.favoriteMovies.find((m) => m.id === movie.id);

        if (!isFavorite) {
            this.favoriteMovies.push(movie);
        } else {
            this.favoriteMovies = this.favoriteMovies.filter((m) => m.id !== movie.id);
        }
    }

    public getMoviesByGenre(genre: TmdbMovieGenreModel['id'],
        page = 1,
        sortBy = 'popularity.desc'
    ): void {
        this.httpClient
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
            .pipe(
                map(({ results }) => this.updateFavotie(results)),
                tap((results) => { console.log('getMoviesByGenre', results); })
            ).subscribe((movies) => { this.moviesSubject$.next(movies); });
    }

    public getMovieList(
        category: string,
        page: number = 1,
        sortBy = 'popularity.desc'
    ): void {
        const { themoviedbBaseUrl: baseUrl } = environment;

        if (category == 'favorite') {
            this.moviesSubject$.next(this.favoriteMovies);
        } else {
            this.httpClient
                .get<{ results: TmdbMovieModel[] }>(`${baseUrl}/3/movie/${category}`, {
                    params: { page, sort_by: sortBy },
                })
                .pipe(map(({ results }) => this.updateFavotie(results)))
                .subscribe((movies) => { this.moviesSubject$.next(movies); });
        }
    }

    private updateFavotie(movies: TmdbMovieModel[]): TmdbMovieModel[] {
        return movies.map((movie) => ({
            ...movie,
            favorite: this.favoriteMovies.some((m) => m.id === movie.id),
        }));
    }
}