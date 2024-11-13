export interface ChatbotMovieModel {
    posterPath: string;
    adult: boolean;
    overview: string;
    releaseDate: string;
    genreIds: number[];
    id: string;
    originalTitle: string;
    originalLanguage: string;
    title: string;
    backdropPath: string | null;
    popularity: number;
    voteCount: number;
    video: boolean;
    voteAverage: number;
    favorite: boolean;
}