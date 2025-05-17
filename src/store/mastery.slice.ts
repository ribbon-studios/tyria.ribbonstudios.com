import { atom, computed, map } from 'nanostores';
import { json } from '@/utils/parsers';

export type TrueMasterySlice = {
  version: number;
  categories: Record<number, MasteryTier>;
};

export enum MasteryTier {
  /**
   * The meta achievement of the category has been finished.
   */
  META = 0,

  /**
   * The entire category has been finished.
   */
  TRUE = 1,
}

if (localStorage.getItem('true-mastery')) {
  localStorage.setItem('mastery', localStorage.getItem('true-mastery')!);
  localStorage.removeItem('true-mastery');
}

const cachedState = json<TrueMasterySlice>(localStorage.getItem('mastery'));

// Upgrade older state
if (cachedState) {
  if (
    cachedState.version === 0 &&
    Array.isArray(cachedState.categories) &&
    cachedState.categories.length > 0 &&
    typeof cachedState.categories[0] === 'number'
  ) {
    cachedState.version = 1;
    cachedState.categories = cachedState.categories.reduce<Record<number, MasteryTier>>((output, category) => {
      output[category] = MasteryTier.TRUE;
      return output;
    }, {});

    localStorage.setItem('mastery', JSON.stringify(cachedState));
  }
}

export const $version = atom<number>(cachedState?.version ?? 1);
export const $category_masteries = map<Record<number, MasteryTier>>(cachedState?.categories);

export const getMasteryByCategoryID = (id: number) => {
  return computed([$category_masteries], (category_masteries) => {
    return category_masteries[id];
  });
};
