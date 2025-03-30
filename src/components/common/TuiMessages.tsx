import { cn } from '@/utils/cn';

import * as styles from './TuiMessages.module.css';
import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useAnimating } from '@/hooks/use-animating';

export const TuiMessages: FC<TuiMessages.Props> = ({ messages, ...props }) => {
  const messagesContainer = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!messagesContainer.current) return;

    const element = messagesContainer.current;

    if (messages.length > 0) {
      setOpen(true);
      element.style.height = `${element.scrollHeight}px`;
    } else {
      element.style.height = '';
    }
  }, [messagesContainer, messages]);

  return (
    <div {...props} className={cn(styles.messages, open && styles.open)} ref={messagesContainer}>
      {messages}
    </div>
  );
};

export namespace TuiMessages {
  export type Props = {
    messages: string[];
  };
}
