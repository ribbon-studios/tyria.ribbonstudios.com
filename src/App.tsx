import { useState, type FC } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import * as styles from './App.module.css';
import { SideBar } from './components/common/SideBar';
import { TopBar } from './components/common/TopBar';
import { Info, Siren, TriangleAlert } from 'lucide-react';
import { $app_loading } from './store/api';
import { Loading } from './components/common/Loading';
import { TuiImage } from './components/common/TuiImage';
import { $background_url } from './store/settings';
import { Ribbon } from '@ribbon-studios/ribbon';
import { useStore } from '@nanostores/react';

export const Component: FC = () => {
  const background_url = useStore($background_url);
  const loading = useStore($app_loading);
  const [open, setOpen] = useState(false);
  const [isBackgroundLoading, setBackgroundLoading] = useState(true);
  const location = useLocation();

  return (
    <>
      <div className={styles.overlay}>
        <TuiImage className={styles.background} src={background_url} onLoad={() => setBackgroundLoading(false)} />
      </div>
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
      <Loading
        className="min-h-dvh"
        contentClassName={styles.app}
        loading={loading || isBackgroundLoading}
        size={128}
        delay={500}
        direction="horizontal"
        center
      >
        <SideBar open={open} onClose={() => setOpen(false)} />
        <div className={styles.container}>
          <TopBar onSideBarToggle={() => setOpen(!open)} />
          <div id="top-bar-root"></div>
          <div className={styles.window}>
            <div className={styles.content}>
              <Outlet />
            </div>
          </div>
        </div>
        {window.location.hostname === 'localhost' && (
          <Ribbon
            as={Link}
            position="top-right"
            backgroundColor="rebeccapurple"
            color="white"
            to={`https://tyria.ribbonstudios.com${location.pathname}${location.search}`}
            target="_blank"
          >
            Local
          </Ribbon>
        )}
      </Loading>
    </>
  );
};
