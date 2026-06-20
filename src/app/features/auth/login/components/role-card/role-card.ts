import { Component, input } from '@angular/core';

@Component({
  selector: 'role-card',
  imports: [],
  templateUrl: './role-card.html',
  styleUrls: ['./role-card.css'],
})
export class RoleCard {
  roleTag = input.required<string>();
  heading = input.required<string>();
  description = input<string>('');
  capabilities = input<string[]>([]);
  credential = input<string>('');
}
