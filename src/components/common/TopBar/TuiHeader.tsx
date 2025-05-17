import { $header } from '@/store/app';
import { Fragment, useMemo } from 'react';
import { TuiIcon } from '../TuiIcon';
import { TuiLink } from '../TuiLink';
import { useBreakpoints } from '@/hooks/use-breakpoints';
import * as styles from './TuiHeader.module.css';
import { useStore } from '@nanostores/react';

export function TuiHeader() {
  const { mdAndUp } = useBreakpoints();
  const { breadcrumbs, image } = useStore($header);

  const final_breadcrumb = useMemo(() => {
    if (breadcrumbs.length === 0) return null;
    return breadcrumbs[breadcrumbs.length - 1].label;
  }, [breadcrumbs]);

  if (mdAndUp) {
    return (
      <div className={styles.header}>
        <TuiLink className="flex items-center gap-4" to="/">
          <TuiIcon icon={image ?? '/favicon.png'} size={48} />
          Tyria UI
        </TuiLink>
        {breadcrumbs.map(({ label, link }, i) => (
          <Fragment key={i}>
            &gt;
            {link ? <TuiLink to={link}>{label}</TuiLink> : <div>{label}</div>}
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.header}>
      <TuiIcon icon={image ?? '/favicon.png'} size={48} />
      {final_breadcrumb ?? 'Tyria UI'}
    </div>
  );
}
