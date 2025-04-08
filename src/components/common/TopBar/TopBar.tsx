import { type FC } from 'react';
import { Menu, Settings } from 'lucide-react';
import { Button } from '../Button';
import { NavLink } from 'react-router-dom';
import { TuiHeader } from './TuiHeader';

export const TopBar: FC<TopBar.Props> = ({ onSideBarToggle }) => {
  return (
    <div className="flex px-6 bg-tui-dark max-w-dvw min-h-[72px]">
      <div className="flex gap-2 md:gap-4 flex-1 items-center mx-auto w-full max-w-[1200px]">
        <Button className="inline-flex md:hidden" onClick={() => onSideBarToggle()}>
          <Menu />
        </Button>
        <TuiHeader />
        <div className="flex gap-2 ml-auto">
          <Button as={NavLink} color="light" to="/settings">
            <Settings />
            <span className="hidden lg:inline-flex">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export namespace TopBar {
  export type Props = {
    onSideBarToggle: () => void;
  };
}
