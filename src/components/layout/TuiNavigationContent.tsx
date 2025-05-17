import { PanelLeft, Settings } from 'lucide-react';
import { RibbonButton } from '../common/RibbonButton';
import { RibbonLink } from '../common/RibbonLink';
import logo from '../../../public/favicon.png';
import Link from 'next/link';

export function TuiNavigationContent() {
  return (
    <>
      <Link className="flex gap-4 text-2xl font-bold hover:underline items-center" href="/">
        <img src={logo.src} style={{ width: 48, height: 48 }} />
        Tyria UI
      </Link>
      <div className="flex-1" />
      <RibbonButton as={RibbonLink} color="light-gray" href="/settings">
        <Settings />
        Settings
      </RibbonButton>
    </>
  );
}
