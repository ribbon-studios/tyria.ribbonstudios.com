import { selectHeader } from '@/store/app.slice';
import { type FC } from 'react';
import { useSelector } from 'react-redux';
import { Settings } from 'lucide-react';
import { Button } from '../Button';
import { Link } from 'react-router-dom';
import { TuiIcon } from '../TuiIcon';

export const TopBar: FC = () => {
  const header = useSelector(selectHeader);

  return (
    <div className="flex px-6 bg-tui-dark min-h-[72px]">
      <div className="flex flex-1 items-center justify-between mx-auto w-full max-w-[1200px]">
        <div className="flex gap-4 items-center text-2xl font-bold">
          {header.image && <TuiIcon icon={header.image} size={48} />}
          Tyria UI - {header.label}
        </div>
        <div className="flex gap-2">
          <Button as={Link} color="light" to="/settings">
            <Settings />
            <span className="hidden lg:inline-flex">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
