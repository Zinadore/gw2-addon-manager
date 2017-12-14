import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, selectFirstRunState, selectLoadingState } from './reducers/index';
import { Observable } from 'rxjs/Observable';
import { ComponentBase } from './components/component-base';
import { AddonService } from './providers/addon.service';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMapTo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends ComponentBase {
  public isLoading$: Observable<boolean>;

  constructor(private electronService: ElectronService,
              private addonService: AddonService,
              private router: Router,
              private store: Store<AppState>) {
    super();
    this.isLoading$ = this.store.select(selectLoadingState);

    this.addonService.init();

    this.disposeOnDestroy(this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe((e: NavigationStart) => console.log(e.url)));

    this.disposeOnDestroy(this.isLoading$
      .filter(v => !v)
      .switchMapTo(this.store.select(selectFirstRunState))
      .subscribe(firstRun => {
      if (firstRun) {
        router.navigate(['/first-run']);
      } else {
        router.navigate(['/addons']);
      }
    }));
  }

  clearSettings(): void {
    this.electronService.clearSettings();
  }
}
