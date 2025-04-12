import { ApiError } from '@/service/api';

export function TuiError({ error }: TuiError.Props) {
  if (ApiError.is(error)) {
    return <div className="text-center text-tui-error">{error.content.text}</div>;
  }

  return error?.toString() ?? error;
}

export namespace TuiError {
  export type Props = {
    error?: any;
  };
}
