import * as styles from './TuiMessages.module.css';
import { useEffect, useMemo, useState } from 'react';
import { Accordion } from './Accordion';

export function TuiMessages({ messages }: TuiMessages.Props) {
  const isOpen = useMemo(() => {
    return messages.length > 0;
  }, [messages]);
  const [cachedMessages, setCachedMessages] = useState<string[]>(messages);

  useEffect(() => {
    if (messages.length === 0) return;

    setCachedMessages([...messages]);
  }, [messages]);

  return (
    <Accordion
      activeClassName={styles.active}
      contentClassName={styles.messages}
      isOpen={isOpen}
      onCloseFinished={() => setCachedMessages(messages)}
    >
      {cachedMessages}
    </Accordion>
  );
}

export namespace TuiMessages {
  export type Props = {
    messages: string[];
  };
}
