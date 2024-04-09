import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'movies/favorite',
        pathMatch: 'full'
    },
    {
        path: 'movies/:category',
        loadComponent: () =>
            import('./movie/movie-list-shell/movie-list-shell.component').then(
                m => m.MovieListShellComponent
            ),
    },
    {
        path: 'movies/genre/:id',
        loadComponent: () =>
            import('./movie/movie-list-shell/movie-list-shell.component').then(
                m => m.MovieListShellComponent
            ),
    },
    {
        path: '**',
        loadComponent: () =>
            import('./not-found/not-found.component').then(
                m => m.NotFoundComponent
            ),
    }
];
