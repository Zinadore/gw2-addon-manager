import { Action, ActionReducerMap, createSelector } from '@ngrx/store';
import { addonReducer } from '../addons/addons.reducer';
import { AddonState } from '../addons/models/addon';

export interface AppState extends AddonState {
  settings: SettingsState;
}

interface SettingsState {
    isFirstRun: boolean;
    installation_path: string;
    loading: boolean;
}

export const reducers: ActionReducerMap<any> = {
  addons: addonReducer,
  settings: settingsReducer
};

const INITIAL_SETTINGS: SettingsState = {
    isFirstRun: true,
    installation_path: '',
    loading: true
};

export function settingsReducer(state: SettingsState = INITIAL_SETTINGS, action: SettingsActions): SettingsState {
  switch (action.type) {
    case CHANGE_SETTING: {
      const newValue = {};
      newValue[action.key] = action.value;

      return Object.assign({}, state, newValue);
    }
    default: return state;
  }
}

export const CHANGE_SETTING = '[Settings] Update';

export class ChangeSetting implements Action {
  readonly type = CHANGE_SETTING;
  constructor(public key: string, public value: any) { }
}

export type SettingsActions = ChangeSetting;

export const selectSettings = (state: AppState) => state.settings;
export const selectLoadingState = createSelector(selectSettings, settings => settings.loading);
export const selectFirstRunState = createSelector(selectSettings, settings => settings.isFirstRun);
