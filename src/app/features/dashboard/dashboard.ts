import { Component, inject } from '@angular/core';
import { AuthStore } from '@core/auth/auth.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly authStoreService = inject(AuthStore);
  private router = inject(Router);

  logout(event: Event) {
    event.preventDefault();
    this.authStoreService.logout();
    void this.router.navigate(['/']);
  }
}
