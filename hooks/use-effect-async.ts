import { type DependencyList, useEffect } from 'react';

export const useEffectAsync = (fn: () => Promise<any>, deps: DependencyList) => {
  useEffect(() => {
    async function asyncFunction() {
      await fn();
    }
    asyncFunction();
  }, deps);
};
