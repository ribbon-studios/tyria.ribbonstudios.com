import { useRef, type FC, type ReactNode } from 'react';
import * as styles from './Accordion.module.css';

export const Accordion: FC<Accordion.Props> = ({ children, isOpen }) => {
  const childrenElement = useRef<HTMLDivElement>(null);

  return (
    <div
      className={styles.accordion}
      style={{
        height: isOpen ? childrenElement.current?.scrollHeight : undefined,
      }}
      ref={childrenElement}
    >
      {children}
    </div>
  );
};

export namespace Accordion {
  export type Props = {
    children: ReactNode;
    isOpen?: boolean;
  };
}
