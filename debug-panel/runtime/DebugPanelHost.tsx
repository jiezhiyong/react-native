import Constants from 'expo-constants';
import * as React from 'react';

import { Main as DebugPanel } from '../components/Main';
import { registerDevelopmentDebugPanelMenu } from '../dev-menu/register';
import { useDebugPanelStore } from '../hooks/useDebugPanel';
import { PreviewDebugPanelTriggers } from '../triggers/PreviewDebugPanelTriggers';

type Props = {
  children: React.ReactNode;
};

type DebugExtra = {
  appVariant?: string;
};

function getDebugExtra() {
  return Constants.expoConfig?.extra as DebugExtra | undefined;
}

function getDebugPanelMode() {
  const extra = getDebugExtra();

  if (extra?.appVariant === 'preview') {
    return 'preview';
  }

  if (__DEV__ || extra?.appVariant === 'development') {
    return 'development';
  }

  return 'off';
}

export function DebugPanelHost({ children }: Props) {
  const mode = getDebugPanelMode();
  const isVisible = useDebugPanelStore((state) => state.isVisible);
  const setVisible = useDebugPanelStore((state) => state.setVisible);

  const openDebugPanel = React.useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  React.useEffect(() => {
    if (mode === 'development') {
      registerDevelopmentDebugPanelMenu(openDebugPanel);
    }
  }, [mode, openDebugPanel]);

  if (mode === 'off') {
    return <>{children}</>;
  }

  if (mode === 'preview') {
    return (
      <>
        <PreviewDebugPanelTriggers disabled={isVisible} onOpen={openDebugPanel}>
          {children}
        </PreviewDebugPanelTriggers>
        <DebugPanel />
      </>
    );
  }

  return (
    <>
      {children}
      <DebugPanel />
    </>
  );
}
