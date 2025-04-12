import { GuildWars2 } from '@ribbon-studios/guild-wars-2';

export const api = new GuildWars2();

export type ApiError = {
  status: number;
  content: {
    text: string;
  };
};

export namespace ApiError {
  export function is(error: any): error is ApiError {
    return typeof error === 'object' && typeof error.status === 'number';
  }
}
