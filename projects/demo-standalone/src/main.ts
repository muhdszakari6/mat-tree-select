import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from './app/app.component';

// No NgModule anywhere: this app checks that the standalone components work on their own.
bootstrapApplication(AppComponent, {
  providers: [
    // Required by Material 19; harmless (deprecated) on Material 20+.
    provideAnimationsAsync()
  ]
}).catch(err => console.error(err));
