import { GuildWars2 } from '@ribbon-studios/guild-wars-2';

export const api = new GuildWars2();

export type ApiError = {
  status: number;
  content: {
    text: string;
  };
};
