import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { MovieStore } from '../../services/movie-store';
import { ActivatedRoute } from '@angular/router';
import { MoviePaginationComponent } from '../movie-pagination/movie-pagination.component';

@Component({
    selector: 'movie-chatbot-card',
    standalone: true,
    template: `
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
    styleUrls: [],
})
export class MovieChatbotCardComponent {
}