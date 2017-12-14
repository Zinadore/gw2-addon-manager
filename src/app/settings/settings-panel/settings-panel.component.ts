import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../components/component-base';
import { AppState, ChangeSetting } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { SettingsKeys } from '../../config/app.settings';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss']
})
export class SettingsPanelComponent extends ComponentBase implements OnInit {

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
  }

  onPathChanged(event) {
    this.store.dispatch(new ChangeSetting(SettingsKeys.InstallationPath, event));
  }

}
