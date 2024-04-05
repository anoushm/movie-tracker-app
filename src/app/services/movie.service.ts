import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { TmdbMovieGenreModel } from '../shared/models/tmdb-movie-genre.model';
import { environment } from '../../enviroments/enviroments';
import { TmdbMovieModel } from '../shared/models/tmdb-movie.model';

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    constructor(private httpClient: HttpClient) { }

    public getGenres(): Observable<TmdbMovieGenreModel[]> {
        return this.httpClient
            .get<{
                genres: TmdbMovieGenreModel[];
            }>(`${environment.themoviedbBaseUrl}/3/genre/movie/list`)
            .pipe(map(({ genres }) => genres));
    }

    // public getMoviesByGenre(genreId: number): Observable<any> {
    //     return this.httpClient
    //         .get<any>(`${environment.themoviedbBaseUrl}/3/discover/movie?with_genres=${genreId}`);
    // }

    public getMoviesByGenre(
        genre: TmdbMovieGenreModel['id'],
        page = 1,
        sortBy = 'popularity.desc'
    ): Observable<TmdbMovieModel[]> {
        return this.httpClient
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
                map(({ results }) => results),
                tap((results) => { console.log('getMoviesByGenre', results); })
            );
    }

    public getMovieList(
        category: string,
        page: number = 1,
        sortBy = 'popularity.desc'
    ): Observable<TmdbMovieModel[]> {
        const { themoviedbBaseUrl: baseUrl } = environment;

        return this.httpClient
            .get<{ results: TmdbMovieModel[] }>(`${baseUrl}/3/movie/${category}`, {
                params: { page, sort_by: sortBy },
            })
            .pipe(map(({ results }) => results));
    }
}