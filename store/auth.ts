import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { secureStorage } from '~/lib/secure-storage';

// 认证状态接口
interface AuthState {
  // 用户会话令牌
  session: string | null;
  // 用户 ID
  id: string | null;
  // 用户名
  name: string | null;
  // 用户头像
  avatar: string | null;
  // 手机号
  mobile: string | null;
  // 加载状态
  isLoading: boolean;
  // 登录方法
  signIn: (credentials: { username?: string; password?: string; accessToken?: string }) => Promise<void>;
  // 登出方法
  signOut: () => Promise<void>;
}

// 创建认证状态存储
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      id: null,
      name: null,
      avatar: null,
      mobile: null,
      isLoading: true,

      // 登录方法
      signIn: async (credentials) => {
        set({ isLoading: true });

        try {
          // TODO: 这里应该实现实际的登录逻辑，例如调用 API
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // 模拟成功登录
          set({
            session: 'session_abc',
            id: 'id_123456',
            name: '张三',
            avatar: 'avatar.png',
            mobile: '138 **** 1234',
            isLoading: false,
          });
        } catch (error) {
          console.error('登录失败:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // 登出方法
      signOut: async () => {
        set({ isLoading: true });

        try {
          // TODO: 这里应该实现实际的登出逻辑，例如调用 API 使令牌失效
          await new Promise((resolve) => setTimeout(resolve, 500));

          // 清除用户会话
          set({
            session: null,
            id: null,
            name: null,
            avatar: null,
            mobile: null,
            isLoading: false,
          });
        } catch (error) {
          console.error('登出失败:', error);
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        session: state.session,
        id: state.id,
        name: state.name,
        avatar: state.avatar,
        mobile: state.mobile,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);

// 辅助钩子，用于在组件中获取认证状态
export function useAuth() {
  const { session, id, name, avatar, mobile, isLoading, signIn, signOut } = useAuthStore();

  return {
    session,
    id,
    name,
    avatar,
    mobile,
    isLoading,
    signIn,
    signOut,
  };
}
