import type { ReactNode } from 'react';

export function DebugPanelHost({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function DebugPanel() {
  return null;
}
