import { Component } from '@angular/core';
import { PreloaderComponent } from 'src/app/components/preloader/preloader.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'portal-gnv';
  loaderComponent = PreloaderComponent;
  
}
