import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

export function useQueryParam(name: string): UseQueryParam.Response<string> {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState<string | undefined>(searchParams.get(name) ?? undefined);

  useEffect(() => {
    const updatedParams = new URLSearchParams(location.search);

    if (value) {
      updatedParams.set(name, value);
    } else if (!value) {
      updatedParams.delete(name);
    }

    if (searchParams.toString() === updatedParams.toString()) return;

    navigate(
      {
        search: updatedParams.toString(),
      },
      {
        replace: true,
      }
    );
  }, [value, name, location]);

  return [value, setValue];
}

export namespace UseQueryParam {
  export type Response<T> = [T | undefined, Dispatch<SetStateAction<T | undefined>>];
}
