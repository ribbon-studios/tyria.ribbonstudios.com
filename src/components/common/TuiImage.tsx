import { useState } from 'react';
import * as styles from './TuiImage.module.css';
import { cn } from '@/utils/cn';

export function TuiImage({ src, className, onLoad, ...props }: TuiIcon.Props) {
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
}

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
