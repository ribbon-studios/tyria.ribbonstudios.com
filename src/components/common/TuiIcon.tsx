import { useMemo } from 'react';
import { type LucideIcon } from 'lucide-react';

export function TuiIcon({ icon: Icon, size = 24, ...props }: TuiIcon.Props) {
  if (!Icon) return null;

  const { img: imgSize, icon: iconSize } = useMemo<TuiIcon.Sizes>(
    () =>
      typeof size === 'object'
        ? size
        : {
            icon: size,
            img: size,
          },
    [size]
  );

  if (typeof Icon === 'string') {
    return (
      <img
        {...props}
        src={Icon}
        style={{
          minHeight: imgSize,
          minWidth: imgSize,
          height: imgSize,
          width: imgSize,
        }}
      />
    );
  }

  return (
    <Icon
      {...props}
      style={{
        minHeight: iconSize,
        minWidth: iconSize,
        height: iconSize,
        width: iconSize,
      }}
    />
  );
}

export namespace TuiIcon {
  export type Props = {
    icon?: LucideIcon | string;
    className?: string;
    size?: number | Sizes;
    title?: string;
  };

  export type Sizes = {
    img: number;
    icon: number;
  };
}
