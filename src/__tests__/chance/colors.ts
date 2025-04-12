import { Color } from '@/types';

export type IChanceCSS = {
  colors: (this: Chance.Chance) => Color;
};

export const mixin: IChanceCSS = {
  colors: function () {
    return this.pickone<Color>(Color.Options);
  },
};
