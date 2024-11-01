import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loader.component.html',
})
export class LoaderComponent {
  @Input()
  text = '';
}
