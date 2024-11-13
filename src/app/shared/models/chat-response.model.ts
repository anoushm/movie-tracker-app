import { TmdbMovieModel } from "./tmdb-movie.model";

export interface ChatResponseModel {
  role: string;
  text: string;
  movieList: TmdbMovieModel[] | null;
}
