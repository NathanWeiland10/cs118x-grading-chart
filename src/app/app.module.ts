import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgParticlesModule} from 'ng-particles';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {StatsPanelComponent} from './components/stats-panel/stats-panel.component';

import {ButtonModule} from 'primeng/button';
import {ChartModule} from 'primeng/chart';

@NgModule({
  declarations: [
    AppComponent,
    StatsPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    ChartModule,
    NgParticlesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
