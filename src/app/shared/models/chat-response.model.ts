export interface ChatResponseModel {
  role: string;
  text: string;
  movieList: {
    movieId: string;
    movieName: string;
  }[];
}