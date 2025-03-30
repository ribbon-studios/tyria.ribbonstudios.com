import { useMemo, useState, type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import * as styles from './App.module.css';
import { SideBar } from './components/common/SideBar';
import { TopBar } from './components/common/TopBar';
import { Info, Siren, TriangleAlert } from 'lucide-react';

const images = [
  '/backgrounds/background-1.jpg',
  '/backgrounds/background-2.jpg',
  '/backgrounds/background-3.jpg',
  '/backgrounds/background-4.jpg',
];

export const Component: FC = () => {
  const [open, setOpen] = useState(false);
  const background = useMemo(() => {
    return images[Math.floor(Math.random() * images.length)];
  }, []);

  return (
    <>
      <div
        className={styles.background}
        style={{
          backgroundImage: `url(${background})`,
        }}
      />
      <div className={styles.app}>
        <SideBar open={open} onClose={() => setOpen(false)} />
        <div className={styles.container}>
          <TopBar onSideBarToggle={() => setOpen(!open)} />
          <div className={styles.content}>
            <Toaster
              theme="dark"
              position="top-center"
              offset={{
                top: 80,
              }}
              toastOptions={{
                classNames: {
                  toast: 'bg-tui-dark! md:left-[150px] gap-4!',
                },
              }}
              icons={{
                warning: <TriangleAlert />,
                error: <Siren />,
                info: <Info />,
              }}
            />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
