import { useAppDispatch } from '@/store';
import { setHeader } from '@/store/app.slice';
import { useEffect, type FC } from 'react';

export const Component: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setHeader({
        breadcrumbs: [],
      })
    );
  }, []);

  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mx-auto max-w-[1800px]"></div>;
};
