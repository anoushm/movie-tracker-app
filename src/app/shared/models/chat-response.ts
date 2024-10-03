interface ChatResponse {
    messages: {
        role: 'user' | 'assistant';
        text: string;
        movieList?: {
            movieId: string;
            movieName: string;
        }[];
    }[];
}