import { TmdbMovieModel } from "./tmdb-movie.model";

export interface ChatResponseModel {
  role: 'user' | 'assistant';
  text: string;
  movieList: TmdbMovieModel[] | null;
}
