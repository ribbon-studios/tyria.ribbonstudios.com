import { useState, type FC } from 'react';
import * as styles from './TuiImage.module.css';
import { cn } from '@/utils/cn';

export const TuiImage: FC<TuiIcon.Props> = ({ src, className, onLoad, ...props }) => {
  const [loading, setLoading] = useState(true);

  return (
    <img
      {...props}
      className={cn(styles.image, loading && styles.loading, className)}
      src={src}
      onLoad={() => {
        setLoading(false);
        onLoad?.();
      }}
    />
  );
};

export namespace TuiIcon {
  export type Props = {
    src: string;
    className?: string;
    onLoad?: () => void;
  };

  export type Sizes = {
    img: number;
    icon: number;
  };
}
