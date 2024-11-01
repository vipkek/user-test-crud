import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserModel } from '@interfaces/user';

@Component({
  selector: 'user-item',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
})
export class UserItemComponent {
  @Input()
  user: UserModel | undefined;

  @Output()
  deleteUser = new EventEmitter<void>();
}
