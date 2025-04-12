import { Chance } from 'chance';
import { mixin as css, type IChanceCSS } from './colors';

export type CustomChance = Chance.Chance & IChanceCSS;

export const chance = new Chance() as CustomChance;
chance.mixin(css);
