import type { ComponentProps, FC, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import * as styles from './Button.module.css';

export const Button: FC<Button.Props> = ({ className, children, color = 'dark', disabled, loading, ...props }) => {
  return (
    <button
      {...props}
      className={cn(styles.button, styles[color], loading && styles.loading, className)}
      disabled={disabled || loading}
    >
      <Loader2 className={styles.loader} />
      <div className={styles.content}>{children}</div>
    </button>
  );
};

export namespace Button {
  export type Props = {
    className?: string;
    children?: ReactNode;
    color?: 'dark' | 'light';
    disabled?: boolean;
    loading?: boolean;
  } & Pick<ComponentProps<'button'>, 'onClick'>;
}
