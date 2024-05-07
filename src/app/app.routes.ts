import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'movies/popular',
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
    { path: '', redirectTo: 'movies/popular', pathMatch: 'full' },
    { path: '**', redirectTo: 'movies/popular', pathMatch: 'full' }
  
    // { path: '', redirectTo: 'movies/popular' },
    // { path: '**', redirectTo: 'movies/popular' },
    // {
    //     path: '**',
    //     loadComponent: () =>
    //         import('./not-found/not-found.component').then(
    //             m => m.NotFoundComponent
    //         ),
    // }
];
