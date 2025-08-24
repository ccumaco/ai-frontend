import { useEffect, useRef, useCallback } from 'react';

const useIsMounted = (): (() => boolean) => {
  const isMounted = useRef<boolean>(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
};

export default useIsMounted;
