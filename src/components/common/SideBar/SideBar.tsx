import { api } from '@/service/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type FC } from 'react';
import { Bug, Code2, Eye, Menu } from 'lucide-react';
import { SideBarItem } from './SideBarItem';
import { Loading } from '../Loading';
import * as styles from './SideBar.module.css';
import { Link, NavLink, useParams } from 'react-router-dom';
import { TuiInput } from '../TuiInput';
import { cn } from '@/utils/cn';
import { Button } from '../Button';
import { TuiIcon } from '../TuiIcon';
import { useSelector } from 'react-redux';
import { selectTrueMasteries } from '@/store/true-mastery.slice';
import { DebugInfo } from '@/components/DebugInfo';
import { useBreakpoints } from '@/hooks/use-breakpoints';
import { TuiLink } from '../TuiLink';

export const SideBar: FC<SideBar.Props> = ({ open, onClose }) => {
  const { mdAndUp } = useBreakpoints();
  const true_masteries = useSelector(selectTrueMasteries);
  const [activeGroupId, setActiveGroupId] = useState<string>();
  const params = useParams();

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

  useEffect(() => {
    if (!data || !params.id || (!mdAndUp && !open)) return;

    const id = Number(params.id);

    if (isNaN(id)) return;

    const group = data.groups.find((group) => group.categories.includes(id));

    if (!group) return;

    setActiveGroupId(group.id);

    const category = document.getElementById(`category-${id}`);

    if (!category) return;

    requestAnimationFrame(() => {
      setTimeout(() => {
        category.scrollIntoView({
          behavior: 'smooth',
        });
      }, 200);
    });
  }, [data, open, mdAndUp]);

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
          <TuiLink className="text-2xl font-bold" to="/" onClick={() => onClose()}>
            Tyria UI
          </TuiLink>
        </div>
        <div id="items" className={styles.items}>
          <SideBarItem label="Summary" icon={Menu} className={styles.alternating} />
          <SideBarItem label="Watch List" icon={Eye} className={styles.alternating} />
          {data?.groups.map((group) => (
            <SideBarItem
              key={group.id}
              label={group.name}
              className={styles.alternating}
              isOpen={group.id === activeGroupId}
              onClick={() => setActiveGroupId(activeGroupId === group.id ? undefined : group.id)}
              append={<DebugInfo className="max-w-16">{group.id}</DebugInfo>}
            >
              {data?.categories[group.id].map((category) => (
                <SideBarItem
                  as={NavLink}
                  key={category.id}
                  id={`category-${category.id}`}
                  label={category.name}
                  icon={category.icon}
                  to={`/categories/${category.id}`}
                  onClick={() => onClose()}
                  append={
                    <>
                      {true_masteries.includes(category.id) && (
                        <TuiIcon
                          icon={
                            'https://render.guildwars2.com/file/5A4E663071250EC72668C09E3C082E595A380BF7/528724.png'
                          }
                          size={30}
                        />
                      )}
                      <DebugInfo>{category.id}</DebugInfo>
                    </>
                  }
                />
              ))}
            </SideBarItem>
          ))}
        </div>
        <div className="flex gap-4 px-4 py-3 bg-tui-dark items-center">
          <div className="flex flex-col gap-2 flex-1 text-white/70">
            <div>
              Built with ❤️ by the{' '}
              <Link className="underline" to="https://github.com/ribbon-studios" target="_blank">
                Ribbon Studios
              </Link>{' '}
              Team~
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              color="light"
              as={Link}
              to="https://github.com/ribbon-studios/tyria.ribbonstudios.com/issues"
              target="_blank"
            >
              <Bug />
            </Button>
            <Button
              color="light"
              as={Link}
              to="https://github.com/ribbon-studios/tyria.ribbonstudios.com"
              target="_blank"
            >
              <Code2 />
            </Button>
          </div>
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
