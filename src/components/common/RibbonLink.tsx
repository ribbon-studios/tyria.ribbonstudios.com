'use client';
import { cn } from '@/utils/cn';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

export function RibbonLink({ className, activeClassName = 'active', ...props }: RibbonLink.Props) {
  const pathname = usePathname();

  return <Link className={cn(className, pathname === props.href && activeClassName)} {...props} />;
}

export namespace RibbonLink {
  export type Props = {
    className?: string;
    activeClassName?: string;
  } & LinkProps;
}
