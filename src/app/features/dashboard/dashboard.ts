import { Component, inject, OnInit } from '@angular/core';
import { AuthStore } from '@core/auth/auth.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly authStoreService = inject(AuthStore);
  private router = inject(Router);

  ngOnInit() {
    console.log(this.authStoreService.user());
  }

  logout(event: Event) {
    event.preventDefault();
    this.authStoreService.logout();
    void this.router.navigate(['/']);
  }
}
