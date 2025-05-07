import { Info } from 'lucide-react';
import { TuiInput } from '@/components/common/TuiInput';
import { TuiTooltip } from '@/components/common/TuiTooltip';

export function AchievementSearch(props: AchievementSearch.Props) {
  return (
    <TuiInput
      {...props}
      prependInner={
        <TuiTooltip
          tooltip={<AchievementSearch.Info />}
          tooltipClassName="w-[400px]"
          tooltipContentsClassName="flex flex-col gap-2 text-sm"
          allowLocking
        >
          <Info
            className="cursor-pointer p-[2px] rounded-full transition-all bg-transparent hover:bg-white/20"
            size={26}
          />
        </TuiTooltip>
      }
      mode="input"
      placeholder="Search (e.g. 'Aurora', 'story:&quot;Darkrime Delves&quot;')"
    />
  );
}
export namespace AchievementSearch {
  export type Props = Omit<TuiInput.Props, 'prependInner' | 'mode' | 'placeholder'>;

  const filters: {
    name: string;
    example: string;
    description: string;
  }[] = [
    {
      name: 'has',
      example: 'has:story',
      description: 'Filters an achievement based upon them having a given value.',
    },
    {
      name: 'story',
      example: 'story:"Darkrime Delves"',
      description: "Filters the achievements based on which story missions they're associated with.",
    },
    {
      name: 'strike',
      example: 'strike:"Forging Steel"',
      description: "Filters the achievements based on which strike missions they're associated with.",
    },
    {
      name: 'not',
      example: 'not:has:story',
      description: 'Does in inverse of whatever filter follows.',
    },
  ];

  export function Info() {
    return (
      <>
        <div className="text-base font-bold">Search Help</div>
        <div className="italic">
          Any portion of your search not associated with an advanced search filter (e.g. story:"Darkrime Delves") will
          search the following fields:
        </div>
        <ul className="ml-4 list-disc">
          <li>
            Name <span className="text-tui-muted text-xs italic">(e.g. Making Cents of Jahai)</span>
          </li>
          <li>
            Description <span className="text-tui-muted text-xs italic">(e.g. Can you spare a coin?)</span>
          </li>
          <li>
            Requirement{' '}
            <span className="text-tui-muted text-xs italic">
              (e.g. Find all 40 ancient Jahai coins scattered throughout Jahai Bluffs.)
            </span>
          </li>
        </ul>
        <div className="font-bold">Advanced Searches</div>
        {filters.map((filter, i) => (
          <div key={i} className="flex flex-col ml-2 gap-2 bg-tui-gray/50 px-1 py-0.5 leading-none rounded-sm">
            <div className="flex justify-between font-bold">
              <div>{filter.name}</div>
              <div className="text-tui-muted text-xs italic">(e.g. '{filter.example}')</div>
            </div>

            <div>{filter.description}</div>
          </div>
        ))}
        <div className="italic">All advanced searches support the following formats:</div>
        <ul className="ml-4 list-disc">
          <li>
            story:Darkrime <span className="text-tui-muted text-xs italic">(For when spaces aren't needed)</span>
          </li>
          <li>
            story:"Darkrime Delves" <span className="text-tui-muted text-xs italic">(To allow spaces)</span>
          </li>
        </ul>
      </>
    );
  }
}
