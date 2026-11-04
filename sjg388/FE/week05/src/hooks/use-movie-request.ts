import { useEffect, useState } from 'react';
type RequestState<T> = { status: 'loading' } | { status: 'error'; message: string } | { status: 'success'; data: T };
// A stable loader and a keyed page ensure a new URL never displays an old response.
export function useMovieRequest<T>(loader: (signal: AbortSignal) => Promise<T>, errorMessage: (error: unknown) => string) {
  const [state, setState] = useState<RequestState<T>>({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;
    loader(controller.signal).then(data => {
      if (!ignore) setState({ status: 'success', data });
    }).catch((error: unknown) => {
      if (!ignore) setState({ status: 'error', message: errorMessage(error) });
    });
    return () => { ignore = true; controller.abort(); };
  }, [loader, errorMessage]);
  return state;
}
