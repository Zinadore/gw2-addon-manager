import { Action } from '@ngrx/store';
import { Addon } from './models/addon';

export const UPDATE = '[Add-ons] Update';


export class Update implements Action {
  readonly type = UPDATE;
  constructor(public id: string, public changes: Partial<Addon>) {}
}

export type AddonActions = Update;
