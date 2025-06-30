import { TrailerModel } from './trailer.model';

export interface TmdbMovieModel {
    posterPath?: string;
    poster_path?: string;
    adult: boolean;
    overview: string;
    releaseDate?: string;
    release_date?: string;
    genreIds?: number[];
    genre_ids?: number[];
    id: string;
    originalTitle?: string;
    original_title?: string;
    originalLanguage?: string;
    original_language?: string;
    title: string;
    backdropPath?: string;
    backdrop_path?: string;
    popularity: number;
    voteCount?: number;
    vote_count?: number;
    video: boolean;
    voteAverage?: number;
    vote_average?: number;
    favorite: boolean;
    imdbId?: string;
    trailer?: TrailerModel;
}
