import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { MovieStore } from '../services/movie-store';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-shell',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './app-shell.component.html',
    styleUrls: ['./app-shell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MovieStore]
})
export class AppShellComponent implements OnInit {
  private store = inject(MovieStore);
  private router = inject(Router);

  public error = this.store.errorGenres;
  public genres = this.store.genres;
  public loading = this.store.loadingGenres;

  public ngOnInit(): void {
    this.store.loadGenres().subscribe({
      error: (err) => {
        console.error('Error loading genres:', err);
      }
    });

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

  public toggleSideMenu(event: MouseEvent): void {
    event.preventDefault();
    const wrapper = document.getElementById('wrapper');

    if (wrapper) {
      wrapper.classList.toggle('Sidebar');
    }
  }

  public toggleContent(event: MouseEvent): void {
    event.preventDefault();
    const wrapper = document.getElementById('wrapper');

    if (wrapper) {
      wrapper.classList.toggle('content-toggled');
    }
  }

  public onChatbotSearchClick(event: MouseEvent): void {
  if (window.innerWidth <= 768) {
    this.toggleMenu(event);
  }
  }

}
