import { selectHeader } from '@/store/app.slice';
import { Fragment, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TuiIcon } from '../TuiIcon';
import { TuiLink } from '../TuiLink';
import { useBreakpoints } from '@/hooks/use-breakpoints';
import * as styles from './TuiHeader.module.css';

export function TuiHeader() {
  const { mdAndUp } = useBreakpoints();
  const header = useSelector(selectHeader);

  const final_breadcrumb = useMemo(() => {
    if (header.breadcrumbs.length === 0) return null;
    return header.breadcrumbs[header.breadcrumbs.length - 1].label;
  }, [header.breadcrumbs]);

  if (mdAndUp) {
    return (
      <div className={styles.header}>
        <TuiLink className="flex items-center gap-4" to="/">
          <TuiIcon icon={header.image ?? '/favicon.png'} size={48} />
          Tyria UI
        </TuiLink>
        {header.breadcrumbs.map(({ label, link }, i) => (
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
      <TuiIcon icon={header.image ?? '/favicon.png'} size={48} />
      {final_breadcrumb ?? 'Tyria UI'}
    </div>
  );
}
