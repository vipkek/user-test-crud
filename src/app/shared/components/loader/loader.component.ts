import { Component, Input } from '@angular/core';

@Component({
  selector: 'loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html'
})
export class LoaderComponent {

  @Input()
  text = '';
}
