import { api } from '@/service/api';
import { useQuery } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import { Eye, Menu } from 'lucide-react';
import { SideBarItem } from './SideBarItem';
import { Loading } from '../Loading';
import * as styles from './SideBar.module.css';
import { Link } from 'react-router-dom';
import { TuiInput } from '../TuiInput';
import { cn } from '@/utils/cn';
import { Button } from '../Button';

export const SideBar: FC<SideBar.Props> = ({ open, onClose }) => {
  const [activeGroupId, setActiveGroupId] = useState<string>();

  const { data, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const [groups, categories] = await Promise.all([
        api.v2.achievements.groups.list({
          ids: 'all',
        }),
        api.v2.achievements.categories.list({
          ids: 'all',
        }),
      ]);

      const activeCategories = categories.filter((category) => category.achievements.length > 0);

      const sortedCategories = activeCategories.sort((a, b) => a.order - b.order);

      return {
        groups: groups.sort((a, b) => a.order - b.order),
        categories: groups.reduce<Record<string, typeof categories>>(
          (output, group) => ({
            ...output,
            [group.id]: sortedCategories.filter(({ id }) => group.categories.includes(id)),
          }),
          {}
        ),
      };
    },
  });

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black z-[9999] opacity-0 pointer-events-none transition-opacity',
          open && 'opacity-25 pointer-events-auto'
        )}
        onClick={() => onClose()}
      />
      <Loading loading={isLoading} className={cn(styles.sidebar, open && styles.open)} contentClassName="max-h-dvh">
        <TuiInput className="hidden! md:flex! mx-6 my-[17px] rounded-full!" placeholder="Search..." disabled />
        <div className="flex md:hidden items-center gap-4 mx-6 my-[17px]">
          <Button className="min-w-10" onClick={() => onClose()}>
            <Menu />
          </Button>
          <div className="text-2xl font-bold">Tyria UI</div>
        </div>
        <div className={styles.items}>
          <SideBarItem label="Summary" icon={Menu} className={styles.alternating} />
          <SideBarItem label="Watch List" icon={Eye} className={styles.alternating} />
          {data?.groups.map((group) => (
            <SideBarItem
              key={group.id}
              label={group.name}
              className={styles.alternating}
              isOpen={group.id === activeGroupId}
              onClick={() => setActiveGroupId(activeGroupId === group.id ? undefined : group.id)}
            >
              {data?.categories[group.id].map((category) => (
                <SideBarItem
                  as={Link}
                  key={category.id}
                  label={category.name}
                  icon={category.icon}
                  to={`/categories/${category.id}`}
                />
              ))}
            </SideBarItem>
          ))}
        </div>
      </Loading>
    </>
  );
};

export namespace SideBar {
  export type Props = {
    open: boolean;
    onClose: () => void;
  };
}
