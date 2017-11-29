import { AddonState, INITIAL_STATE, addonAdapter } from './models/addon';
import * as actions from './addons.actions';
import { createFeatureSelector } from '@ngrx/store';

export function addonReducer(state: AddonState = INITIAL_STATE, action: actions.AddonActions) {
  switch (action.type) {
    case actions.UPDATE: {
      return addonAdapter.updateOne({
        id: action.id,
        changes: action.changes
      }, state)
    }
    default:
      return state;
  }
}

export const selectAddonState = createFeatureSelector<AddonState>('addons');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = addonAdapter.getSelectors(selectAddonState);
