import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  imports: [],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
})
export class PasswordComponent {
  private router: Router = inject(Router);
  private officialDomain = 'https://maribel-gutierrez.dev';

  checkPassword(event: Event, password: string) {
    event.preventDefault();
    if (password === 'iot-website') {
      void this.router.navigate(['/dashboard']);
      return;
    }

    window.location.href = this.officialDomain;
  }
}
