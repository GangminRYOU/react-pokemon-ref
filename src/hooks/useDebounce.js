import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    //예를 들어 1초가 지난 다음 실행
    //근데 1초가 지나기 전에 value값이 들어가면
    //return 되면서 다시 useEffect 실행

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};
