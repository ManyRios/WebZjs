import type { MetaMaskInpageProvider } from '@metamask/providers';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import type { Snap } from '../types';
import { getSnapsProvider } from '../utils';
import { SnapState } from 'src/hooks/snaps/useGetSnapState';

type MetaMaskContextType = {
  provider: MetaMaskInpageProvider | null;
  installedSnap: Snap | null;
  error: Error | null;
  snapState: SnapState | null;
  setSnapState: (SnapState: SnapState) => void;
  setInstalledSnap: (snap: Snap | null) => void;
  setError: (error: Error) => void;
};

const MetaMaskContext = createContext<MetaMaskContextType>({
  provider: null,
  installedSnap: null,
  error: null,
  snapState: null,
  setSnapState: () => {},
  setInstalledSnap: () => {},
  setError: () => {},
});

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  // const { getSnapState } = useGetSnapState();

  const [provider, setProvider] = useState<MetaMaskInpageProvider | null>(null);
  const [installedSnap, setInstalledSnap] = useState<Snap | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [snapState, setSnapState] = useState<SnapState | null>(null);

  useEffect(() => {
    getSnapsProvider().then(setProvider).catch(console.error);
  }, []);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 10000);

      return () => {
        clearTimeout(timeout);
      };
    }

    return undefined;
  }, [error]);

  return (
    <MetaMaskContext.Provider
      value={{
        provider,
        error,
        snapState,
        setSnapState,
        setError,
        installedSnap,
        setInstalledSnap,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

/**
 * Utility hook to consume the MetaMask context.
 *
 * @returns The MetaMask context.
 */
export function useMetaMaskContext() {
  const context = useContext(MetaMaskContext);

  if (context === undefined) {
    throw new Error(
      'useMetaMaskContext must be called within a MetaMaskProvider',
    );
  }

  return context;
}
