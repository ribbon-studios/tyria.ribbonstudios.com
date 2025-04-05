import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useQueryParam(name: string): UseQueryParam.Response<string> {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState<string | undefined>(searchParams.get(name) ?? undefined);

  useEffect(() => {
    const updatedParams = new URLSearchParams(searchParams);

    if (value) {
      updatedParams.set(name, value);
    } else {
      updatedParams.delete(name);
    }

    setSearchParams(updatedParams);
  }, [value, name, searchParams]);

  return [value, setValue];
}

export namespace UseQueryParam {
  export type Response<T> = [T | undefined, Dispatch<SetStateAction<T | undefined>>];
}
