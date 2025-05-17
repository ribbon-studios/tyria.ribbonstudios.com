import { map } from 'nanostores';

export const $header = map<{
  breadcrumbs: Array<{
    label: string;
    link?: string;
  }>;
  image?: string;
}>({
  breadcrumbs: [],
});
