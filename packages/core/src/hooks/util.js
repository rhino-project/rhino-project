import { useEffect, useReducer, useRef, useState } from 'react';

// https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
export const useForceUpdate = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  return forceUpdate;
};

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => savedCallback.current();

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useDebouncedState = (initialValue, delay = 1000) => {
  const [state, setState] = useState(initialValue);
  const [nextState, setNextState] = useState(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (nextState !== state) {
        setState(nextState);
      }
    }, delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextState]);

  const setter = (newValue) => {
    setNextState(newValue);
  };
  return [state, setter, nextState];
};
