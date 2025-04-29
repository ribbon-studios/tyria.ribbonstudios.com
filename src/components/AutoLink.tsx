import { useLinks } from '@/hooks/use-links';
import { api } from '@/service/api';
import { useQuery } from '@tanstack/react-query';
import { useMemo, type ComponentProps, type ElementType } from 'react';

const static_names = [
  'Professor Smoll',
  // TODO: Pull Points of Interest from the API
  'Colosseum of the Faithful',
  'Lava Flats',
  'Osprey Pillars',
  'Burning Grotto',
  // TODO: See if these can be pulled from the v2 item api
  'Spiked Choya Psionic Tonic',
  "Fool's Tall Tonic",
  "Fool's Dog Treat",
  'Chatoyant Elixir',
  'Forging Steel',
];

const excluded_names = ['Sabotage', 'Doubt'];

export function AutoLink<T extends ElementType = 'div'>({ as, children, ...props }: AutoLink.Props<T>) {
  const Component = as ?? 'div';

  const { data: map_names } = useQuery({
    queryKey: ['v1/names'],
    queryFn: async () => {
      const names = await api.v1.mapNames();

      return names.map(({ name }) => name).filter((name) => !excluded_names.includes(name));
    },
    refetchOnWindowFocus: false,
  });

  const names = useMemo(() => {
    if (map_names) {
      return [...map_names, ...static_names];
    }

    return static_names;
  }, [map_names]);

  const name_links = useLinks(names);

  const formattedChildren = useMemo<string>(() => {
    return AutoLink.replaceAll(name_links, children);
  }, [names, children]);

  return (
    <Component
      {...props}
      // TODO: Tailwind Merge handles this scenario incorrectly
      dangerouslySetInnerHTML={{ __html: formattedChildren }}
    />
  );
}

export namespace AutoLink {
  export type Props<T extends ElementType> = {
    as?: T;
    className?: string;
    children: string;
  } & Omit<ComponentProps<T>, 'dangerouslySetInnerHTML'>;

  export function replaceAll(names: Record<string, string>, requirement: string) {
    return Object.keys(names).reduce(
      (output, name) =>
        output.replace(
          name,
          `<a class="text-tui-info hover:underline" target="_blank" href="${names[name]}">${name}</a>`
        ),
      requirement
    );
  }
}
