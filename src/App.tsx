import { useMemo, type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import * as styles from './App.module.css';
import { SideBar } from './components/common/SideBar';
import { TopBar } from './components/common/TopBar';
import { Info, Siren, TriangleAlert } from 'lucide-react';

// 'https://d3b4yo2b5lbfy.cloudfront.net/wp-content/uploads/wallpapers/GuildWars2-09-1920x1080.jpg',
// 'https://d3b4yo2b5lbfy.cloudfront.net/wp-content/uploads/wallpapers/fbd0cgw2-ex5-jw-qr1-wallpaper-1920x1080.jpg',
// 'https://d3b4yo2b5lbfy.cloudfront.net/wp-content/uploads/wallpapers/1ceebqr3-now-live-wallpaper-1920x1080.jpg',

const images = [
  'https://d3b4yo2b5lbfy.cloudfront.net/wp-content/uploads/wallpapers/GuildWars2-11-1920x1080.jpg',
  'https://d3b4yo2b5lbfy.cloudfront.net/wp-content/uploads/wallpapers/GuildWars2-13-1920x1080.jpg',
  'https://d3b4yo2b5lbfy.cloudfront.net/wp-content/uploads/wallpapers/Sylvari-02-1920x1080.jpg',
  'https://d3b4yo2b5lbfy.cloudfront.net/wp-content/uploads/wallpapers/af6953a10506-1920x1080.jpg',
];

export const Component: FC = () => {
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
        <SideBar />
        <div className={styles.container}>
          <TopBar />
          <div className={styles.content}>
            <Toaster
              theme="dark"
              position="top-center"
              offset={{
                top: 80,
              }}
              icons={{
                warning: <TriangleAlert />,
                error: <Siren />,
                info: <Info />,
              }}
              duration={Infinity}
            />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
