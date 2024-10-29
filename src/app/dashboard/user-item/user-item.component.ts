import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserModel } from '../../core/interface/user';

@Component({
  selector: 'user-item',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss'
})
export class UserItemComponent {

  @Input()
  user: UserModel | undefined;

  @Output()
  deleteUser = new EventEmitter<number>();

  constructor() {
  }
}
