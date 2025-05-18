import { Bug, ChevronRight, Code, PanelLeft } from 'lucide-react';
import { RibbonButton } from '../common/RibbonButton';
import { RibbonSearch } from '../common/RibbonSearch';
import { api } from '@/service/api';
import { TuiNavigationItem } from './TuiNavigationItem';
import Image from 'next/image';
import { Fragment } from 'react';
import { RibbonAccordion } from '../common/RibbonAccordion';

export async function TuiSidebarContent() {
  const [groups, categories] = await Promise.all([
    api.v2.achievements.groups.list({
      ids: 'all',
    }),
    api.v2.achievements.categories.list({
      ids: 'all',
    }),
  ]);

  return (
    <>
      <div className="flex gap-2 mx-4 my-[15px]">
        <RibbonButton color="light-gray" variant="outlined">
          <PanelLeft />
        </RibbonButton>
        <RibbonSearch className="flex-1" placeholder="Search by Category..." />
      </div>
      <div className="flex flex-col flex-[1_1_0] overflow-auto">
        {groups.map((group) => (
          <Fragment key={group.id}>
            <TuiNavigationItem alternating>
              <ChevronRight />
              {group.name}
            </TuiNavigationItem>
            <RibbonAccordion open={false}>
              {categories
                .filter((category) => group.categories.includes(category.id))
                .map((category) => (
                  <TuiNavigationItem key={category.id} alternating>
                    <Image src={category.icon} alt="category icon" width={30} height={30} />
                    {category.name}
                  </TuiNavigationItem>
                ))}
            </RibbonAccordion>
          </Fragment>
        ))}
      </div>
      <div className="grid grid-rows-2 grid-cols-[1fr_min-content] items-center px-4 py-3 gap-2">
        <div className="row-span-full">Built with ❤️ by the Ribbon Studios Team~</div>
        <RibbonButton color="light-gray">
          <Bug />
        </RibbonButton>
        <RibbonButton color="light-gray">
          <Code />
        </RibbonButton>
      </div>
    </>
  );
}
