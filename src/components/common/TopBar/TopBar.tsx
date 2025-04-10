import { type FC } from 'react';
import { Menu, Settings } from 'lucide-react';
import { TuiButton } from '../TuiButton';
import { NavLink } from 'react-router-dom';
import { TuiHeader } from './TuiHeader';

export const TopBar: FC<TopBar.Props> = ({ onSideBarToggle }) => {
  return (
    <div className="flex px-6 bg-tui-dark max-w-dvw min-h-[72px]">
      <div className="flex gap-2 md:gap-4 flex-1 items-center mx-auto w-full max-w-[1200px]">
        <TuiButton className="inline-flex md:hidden" onClick={() => onSideBarToggle()}>
          <Menu />
        </TuiButton>
        <TuiHeader />
        <div className="flex gap-2 ml-auto">
          <TuiButton as={NavLink} color="tui-light-gray" to="/settings">
            <Settings />
            <span className="hidden lg:inline-flex">Settings</span>
          </TuiButton>
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
