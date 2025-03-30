import { selectHeader } from '@/store/app.slice';
import { type FC } from 'react';
import { useSelector } from 'react-redux';
import { Settings } from 'lucide-react';
import { Button } from '../Button';
import { Link } from 'react-router-dom';

export const TopBar: FC = () => {
  const header = useSelector(selectHeader);

  const image = header.image && <img className="hidden lg:inline-flex" src={header.image} />;

  return (
    <div className="flex items-center px-10 bg-tui-dark min-h-[72px]">
      <div className="text-2xl font-bold flex-1">Tyria UI</div>
      <div className="flex items-center gap-5">
        {image}
        <div className="font-bold text-xl">{header.label}</div>
        {image}
      </div>
      <div className="flex flex-1 gap-2 justify-end">
        <Button as={Link} color="light" to="/settings">
          <Settings />
          <span className="hidden lg:inline-flex">Settings</span>
        </Button>
      </div>
    </div>
  );
};
