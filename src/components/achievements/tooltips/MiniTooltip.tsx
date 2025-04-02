import { Schema, type Mini } from '@ribbon-studios/guild-wars-2/v2';

export function MiniTooltip({ mini }: MiniTooltip.Props) {
  return (
    <div className="flex flex-col">
      <div className="text-nowrap font-bold">{mini.name}</div>
      {mini.unlock && <div className="italic text-sm text-white/80">{mini.unlock}</div>}
    </div>
  );
}

export namespace MiniTooltip {
  export type Props = {
    mini: Mini<Schema.LATEST>;
  };
}
