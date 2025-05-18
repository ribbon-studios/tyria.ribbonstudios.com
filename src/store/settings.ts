import { atom, map } from 'nanostores';

export enum Background {
  Random = -1,
  Desert = 0,
  Zojja = 1,
  Logan = 2,
  Sylvari = 3,
}

export const $api = map<Settings.Api>({
  refresh_interval: 30,
});

export const $background = atom<Background>(Background.Random);

export const $toggles = map<Settings.Toggles>({
  pin_incomplete_meta_achievements: true,
  pin_search: false,
  hide_completed_achievements: false,
  hide_hidden_achievements: false,
  debug_mode: false,
});

export namespace Settings {
  export type Api = {
    key?: string;
    refresh_interval: number | null;
  };

  export type Toggles = {
    pin_incomplete_meta_achievements: boolean;
    pin_search: boolean;
    hide_completed_achievements: boolean;
    hide_hidden_achievements: boolean;
    debug_mode: boolean;
  };
}
