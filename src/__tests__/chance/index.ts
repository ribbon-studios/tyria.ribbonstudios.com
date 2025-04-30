import { Chance } from 'chance';
import { mixin as css, type IChanceCSS } from './colors';
import { mixin as achievements, type IChanceAchievements } from './achievements';

export type IChanceGeneral = {
  count(value: number | [number, number]): number;
};

const mixin: IChanceGeneral = {
  count(value) {
    return typeof value === 'number' ? value : chance.integer({ min: value[0], max: value[1] });
  },
};

export type CustomChance = Chance.Chance & IChanceGeneral & IChanceCSS & IChanceAchievements;

export const chance = new Chance() as CustomChance;

chance.mixin({
  ...mixin,
  ...css,
  ...achievements,
});
