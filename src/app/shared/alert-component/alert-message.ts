import { Component, computed, Input } from '@angular/core';

@Component({
  selector: 'alert-message',
  imports: [],
  templateUrl: './alert-message.html',
  styleUrl: './alert-message.css',
})
export class AlertMessage {
  @Input({required: true}) message!: string;
}
