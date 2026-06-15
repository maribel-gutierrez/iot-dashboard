import { Component, input } from '@angular/core';

@Component({
  selector: 'alert-message',
  imports: [],
  templateUrl: './alert-message.html',
  styleUrl: './alert-message.css',
})
export class AlertMessage {
  message = input<string>('');
}
