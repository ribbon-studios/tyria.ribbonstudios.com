import { json } from '@/utils/parsers';
import type { TuiSelect } from '@/components/common/TuiSelect';
import { atom, batched, computed, map } from 'nanostores';
import { api } from '@/service/api';

export enum Background {
  Random = -1,
  Desert = 0,
  Zojja = 1,
  Logan = 2,
  Sylvari = 3,
}

export namespace Background {
  export function random() {
    return BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
  }

  export const LabelValues: TuiSelect.LabelValue<Background>[] = Object.entries(Background)
    .filter(([, value]) => typeof value === 'number')
    .map(([label, background]) => ({
      label,
      value: background as Background,
    }));
}

export const BACKGROUNDS = [
  '/backgrounds/background-1.jpg',
  '/backgrounds/background-2.jpg',
  '/backgrounds/background-3.jpg',
  '/backgrounds/background-4.jpg',
];

export type SettingsSlice = {
  api: {
    key?: string;
    refresh_interval: number | null;
  };
  background: Background;
  toggles: {
    pin_incomplete_meta_achievements: boolean;
    pin_search: boolean;
    hide_completed_achievements: boolean;
    hide_hidden_achievements: boolean;
    debug_mode: boolean;
  };
};

const cachedState = json<SettingsSlice>(localStorage.getItem('account'));

/**
 * Update this to force the cache to update.
 */
export const CURRENT_VERSION = 2;

export const $background = atom<Background>(cachedState?.background ?? Background.Random);
export const $background_url = computed($background, (id) => {
  return id === Background.Random ? Background.random() : BACKGROUNDS[id];
});

export const $toggles = map<SettingsSlice['toggles']>({
  pin_incomplete_meta_achievements: true,
  pin_search: false,
  hide_completed_achievements: false,
  hide_hidden_achievements: false,
  debug_mode: false,
  ...cachedState?.toggles,
});

export const $api = map<SettingsSlice['api']>({
  refresh_interval: 30,
  ...cachedState?.api,
});

export const $refresh_interval_ms = computed([$api], ({ refresh_interval }) => {
  return refresh_interval ? refresh_interval * 1000 : undefined;
});

$api.subscribe(({ key }) => {
  api.config.access_token = key;
});

// TODO: Is there a better way of doing this?
const $state = batched([$api, $toggles, $background], (api, toggles, background) => ({
  api,
  toggles,
  background,
}));

$state.listen((state) => {
  localStorage.setItem('account', JSON.stringify(state));
});
