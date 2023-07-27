import { useEffect, useLayoutEffect, useRef } from 'react';

type EffectHookType = typeof useEffect | typeof useLayoutEffect;

type CreateUpdateEffectType = (hook: EffectHookType) => EffectHookType;

export const createUpdateEffect: CreateUpdateEffectType = hook => {
  return (effect, deps) => {
    const isMounted = useRef(false);
    hook(() => {
      return () => {
        isMounted.current = false;
      };
    }, []);

    hook(() => {
      if (!isMounted.current) {
        isMounted.current = true;
      } else {
        return effect();
      }
    }, deps);
  };
};
