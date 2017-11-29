import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface Addon {
  name: string;
  installed: boolean;
  installed_version: string;
  latest_version: string;
  chainload_name?: string;
  id: string;
}

export const addonAdapter = createEntityAdapter<Addon>();
export interface AddonState extends EntityState<Addon> {}

const DEFAULT_STATE = {
  ids: [ 'arcdps', 'build-templates', 'radial-mount-button'],
  entities: {
    'arcdps': {
      id: 'arcdps',
      name: 'ArcDPS',
      installed: false,
      installed_version: '',
      latest_version: '',
      chainload_name: 'd3d9_chainload.dll'
    },
    'build-templates': {
      id: 'build-templates',
      name: 'Build Templates',
      installed: false,
      installed_version: '',
      latest_version: ''
    },
    'radial-mount-button': {
      id: 'radial-mount-button',
      name: 'Radial Mount Button',
      installed: false,
      installed_version: '',
      latest_version: '',
      chainload_name: 'd3d9_mchain.dll'
    }
  }
};

export const INITIAL_STATE: AddonState = addonAdapter.getInitialState(DEFAULT_STATE);

