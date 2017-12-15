import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, ChangeSetting } from '../../reducers/index';
import { SettingsKeys } from '../../config/app.settings';

@Component({
  selector: 'app-first-run',
  templateUrl: './first-run.component.html',
  styleUrls: ['./first-run.component.scss']
})
export class FirstRunComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private store: Store<AppState>) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  onPathSet(event) {
    this.store.dispatch(new ChangeSetting(SettingsKeys.InstallationPath, event));
    this.router.navigate(['/addons']);
  }
}
