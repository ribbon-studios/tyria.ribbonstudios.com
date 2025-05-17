'use client';

import { RibbonInput } from './RibbonInput';

export function RibbonSearch({ ...props }: RibbonSearch.Props) {
  return <RibbonInput {...props} />;
}

export namespace RibbonSearch {
  export type Props = RibbonInput.Props;
}
