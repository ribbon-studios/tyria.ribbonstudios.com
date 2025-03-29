import { useMemo, type FC } from 'react';
import type { LucideIcon } from 'lucide-react';

export const TuiIcon: FC<TuiIcon.Props> = ({ icon: Icon, size = 24, ...props }) => {
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
          height: imgSize,
          width: imgSize,
        }}
      />
    );
  }

  return <Icon {...props} size={iconSize} />;
};

export namespace TuiIcon {
  export type Props = {
    icon: LucideIcon | string;
    className?: string;
    size?: number | Sizes;
  };

  export type Sizes = {
    img: number;
    icon: number;
  };
}
