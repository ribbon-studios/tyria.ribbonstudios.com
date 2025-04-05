import { useEffect, useMemo, useState, type FC } from 'react';
import { Bug, Code2, Eye, Menu } from 'lucide-react';
import { SideBarItem } from './SideBarItem';
import * as styles from './SideBar.module.css';
import { Link, NavLink, useParams } from 'react-router-dom';
import { TuiInput } from '../TuiInput';
import { cn } from '@/utils/cn';
import { Button } from '../Button';
import { useSelector } from 'react-redux';
import { selectMasteryCategories } from '@/store/mastery.slice';
import { DebugInfo } from '@/components/DebugInfo';
import { useBreakpoints } from '@/hooks/use-breakpoints';
import { TuiLink } from '../TuiLink';
import { selectGroups } from '@/store/api.slice';
import { formatter, sanitize } from '@/utils/formatter';
import { MasteryIcon } from '@/components/achievements/MasteryIcon';

export function SideBar({ open, onClose }: SideBar.Props) {
  const { mdAndUp } = useBreakpoints();
  const groups = useSelector(selectGroups);
  const masteries = useSelector(selectMasteryCategories);
  const [activeGroupId, setActiveGroupId] = useState<string>();
  const params = useParams();
  const [search, setSearch] = useState<string>();

  useEffect(() => {
    if (!params.id || (!mdAndUp && !open)) return;

    const id = Number(params.id);

    if (isNaN(id)) return;

    const group = groups.find((group) => group.categories.some((category) => category.id === id));

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
  }, [groups, open, mdAndUp]);

  // TODO: This can be severely optimized by putting the categories under the groups
  const searchResults = useMemo(() => {
    if (!search) return groups;

    const sanitized_search = formatter(search).sanitize.lower.value();

    return groups
      .map((group) => ({
        ...group,
        categories: group.categories.filter((category) => category.name_sanitized.includes(sanitized_search)),
      }))
      .filter((group) => group.categories.length > 0);
  }, [groups, search]);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black z-[9999] opacity-0 pointer-events-none transition-opacity',
          open && 'opacity-25 pointer-events-auto'
        )}
        onClick={() => onClose()}
      />
      <div className={cn(styles.sidebar, open && styles.open)}>
        <TuiInput
          className="hidden! md:flex! mx-6 my-[17px] rounded-full!"
          placeholder="Search by Category..."
          value={search}
          onChange={(value) => setSearch(value)}
          mode="input"
        />
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
          {searchResults.map((group) => (
            <SideBarItem
              key={group.id}
              label={group.name}
              className={styles.alternating}
              isOpen={group.id === activeGroupId}
              onClick={() => setActiveGroupId(activeGroupId === group.id ? undefined : group.id)}
              append={<DebugInfo className="max-w-16">{group.id}</DebugInfo>}
            >
              {group.categories.map((category) => (
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
                      <MasteryIcon masteryTier={masteries[category.id]} size={30} />
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
      </div>
    </>
  );
}

export namespace SideBar {
  export type Props = {
    open: boolean;
    onClose: () => void;
  };
}
