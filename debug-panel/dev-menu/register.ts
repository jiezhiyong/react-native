type DevMenuItem = {
  name: string;
  callback: () => void;
  shouldCollapse?: boolean;
};

type DevMenuModule = {
  registerDevMenuItems: (items: DevMenuItem[]) => Promise<void>;
};

let hasRegistered = false;

export async function registerDevelopmentDebugPanelMenu(openDebugPanel: () => void) {
  if (!__DEV__ || hasRegistered) {
    return;
  }

  hasRegistered = true;

  try {
    const devMenu = (await import('expo-dev-menu')) as DevMenuModule;
    await devMenu.registerDevMenuItems([
      {
        name: '⚙️ Open Debug Panel',
        callback: openDebugPanel,
        shouldCollapse: true,
      },
    ]);
  } catch (error) {
    hasRegistered = false;
    console.warn('注册 DebugPanel dev menu item 失败', error);
  }
}
