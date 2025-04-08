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

  return null;
};
