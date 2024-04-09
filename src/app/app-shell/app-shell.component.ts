import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MovieStore } from '../services/movie-store';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [AsyncPipe,
    RouterLink,
    RouterLinkActive,],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MovieStore]
})
export class AppShellComponent implements OnInit {
  private store = inject(MovieStore);
  public error = this.store.error;
  public genres = this.store.genres;
  public loading = this.store.loading;

  public async ngOnInit(): Promise<void> {
    await this.store.loadGenres();
  }

  public toggleMenu(event: Event): void {
    event.preventDefault();
    const wrapper = document.getElementById('wrapper');

    if (wrapper) {
      wrapper.classList.toggle('toggled');
    }
  }
}
