import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { MovieStore } from '../services/movie-store';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MovieStore]
})
export class AppShellComponent implements OnInit {
  private store = inject(MovieStore);
  private router = inject(Router);

  public error = this.store.error;
  public genres = this.store.genres;
  public loading = this.store.loading;

  public async ngOnInit(): Promise<void> {
    try {
      await this.store.loadGenres();
    } catch (err) {
      console.error('Error loading genres:', err);
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEndEvent = event as NavigationEnd;
      this.updateBodyClass(navEndEvent.urlAfterRedirects);
    });
  }

  private updateBodyClass(url: string): void {
    const body = document.body;
    const className = 'favorite-movies-route';

    if (url === '/movies/favorite') {
      body.classList.add(className);
    } else {
      body.classList.remove(className);
    }
  }

  public toggleMenu(event: MouseEvent): void {
    event.preventDefault();
    const wrapper = document.getElementById('wrapper');

    if (wrapper) {
      wrapper.classList.toggle('toggled');
    }
  }
}
