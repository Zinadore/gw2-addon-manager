import { ActionReducerMap, createSelector } from '@ngrx/store';
import { addonReducer } from '../addons/addons.reducer';
import { AddonState } from '../addons/models/addon';
import * as fromAddon from '../addons/addons.reducer';

export interface AppState extends AddonState {
}

export const reducers: ActionReducerMap<any> = {
  addons: addonReducer
};

