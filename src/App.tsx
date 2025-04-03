import { useEffect, useMemo, useState, type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import * as styles from './App.module.css';
import { SideBar } from './components/common/SideBar';
import { TopBar } from './components/common/TopBar';
import { Info, Siren, TriangleAlert } from 'lucide-react';
import { useSelector } from 'react-redux';
import { fetchAchievementSections, selectApiState, setApiLoading } from './store/api.slice';
import { Loading } from './components/common/Loading';
import { TuiImage } from './components/common/TuiImage';
import { useAppDispatch } from './store';

const images = [
  '/backgrounds/background-1.jpg',
  '/backgrounds/background-2.jpg',
  '/backgrounds/background-3.jpg',
  '/backgrounds/background-4.jpg',
];

export const Component: FC = () => {
  const dispatch = useAppDispatch();
  const api = useSelector(selectApiState);
  const [open, setOpen] = useState(false);
  const [isBackgroundLoading, setBackgroundLoading] = useState(true);
  const background = useMemo(() => {
    return images[Math.floor(Math.random() * images.length)];
  }, []);

  useEffect(() => {
    if (!api.lastUpdated || api.lastUpdated < Date.now() - 86400000) {
      dispatch(fetchAchievementSections());
    } else {
      dispatch(setApiLoading(false));
    }
  }, []);

  return (
    <>
      <div className={styles.overlay}>
        <TuiImage className={styles.background} src={background} onLoad={() => setBackgroundLoading(false)} />
      </div>
      <Loading
        className="min-h-dvh"
        contentClassName={styles.app}
        loading={api.loading || isBackgroundLoading}
        size={128}
        delay={500}
        direction="horizontal"
        center
      >
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
      </Loading>
    </>
  );
};
