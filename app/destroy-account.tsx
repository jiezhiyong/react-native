import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack } from 'expo-router';
import { Info } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import * as z from 'zod';

import { ActivityIndicator } from '@/components/ActivityIndicator';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Text } from '@/components/ui/text';
import { useI18nContext } from '@/i18n/i18n-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

// 定义表单验证模式
const destroyAccountSchema = z.object({
  password: z.string().min(6, { message: '请输入正确的密码' }),
  confirmDestroy: z.boolean().refine((val) => val === true, {
    message: '请确认您理解账户注销的后果',
  }),
});

type DestroyAccountFormValues = z.infer<typeof destroyAccountSchema>;

/**
 * 销毁账号页面
 * 展示应用的销毁账号内容
 */
export default function DestroyAccountScreen() {
  const { LL } = useI18nContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signOut } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DestroyAccountFormValues>({
    resolver: zodResolver(destroyAccountSchema),
    defaultValues: {
      password: '',
      confirmDestroy: false,
    },
  });

  const onSubmit = async (data: DestroyAccountFormValues) => {
    try {
      setIsSubmitting(true);

      // 显示最终确认对话框
      Alert.alert(
        '确认注销账户',
        '此操作不可逆，您的所有数据将被永久删除。确认继续吗？',
        [
          {
            text: '取消',
            style: 'cancel',
            onPress: () => setIsSubmitting(false),
          },
          {
            text: '确认注销',
            style: 'destructive',
            onPress: async () => {
              try {
                // 这里应该调用API来执行账户注销
                // 例如: await apiClient.destroyAccount(data.password);

                // 模拟API调用
                await new Promise((resolve) => setTimeout(resolve, 1500));

                toast.success('账户已注销', {
                  description: '您的账户已成功注销',
                });

                // 注销后返回登录页面
                signOut();
                router.replace('/');
              } catch (error) {
                console.error('注销账户失败:', error);
                toast.error('注销失败', {
                  description: '请稍后再试或联系客服',
                });
                setIsSubmitting(false);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('表单提交错误:', error);
      toast.error('表单提交错误', {
        description: '请检查您的输入并重试',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: LL.routes.destroyAccount(),
        }}
      />

      <View className="flex-1 p-5">
        <Text className="text-2xl font-medium mb-6">账户注销</Text>

        <View className="mb-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
          <View className="flex-row gap-2">
            <Info size={20} color="#c96442" className="mr-2 mt-1" />
            <Text className="flex-1 text-foreground">
              注销账户将永久删除您的所有数据，包括个人信息、历史记录和关联服务。此操作无法撤销。
            </Text>
          </View>
        </View>

        {/* 密码验证 */}
        <View className="gap-2 mb-6">
          <Text className="font-medium mb-2">请输入您的密码以确认身份</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="请输入密码"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                editable={!isSubmitting}
                className={cn(!!errors.password && 'border-destructive')}
              />
            )}
          />
        </View>

        {/* 确认选项 */}
        <View className="gap-2 mb-1">
          <Controller
            control={control}
            name="confirmDestroy"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row items-start">
                <Checkbox checked={value} onCheckedChange={onChange} disabled={isSubmitting} />
                <Text className={cn('flex-1 ml-2 text-foreground', errors.confirmDestroy ? 'text-destructive' : '')}>
                  我理解注销账户将永久删除我的所有数据，且此操作不可逆转
                </Text>
              </View>
            )}
          />
        </View>

        {/* 提交按钮 */}
        <Button variant="destructive" onPress={handleSubmit(onSubmit)} disabled={isSubmitting} className="mt-2">
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#faf9f5" className="mr-2" />
          ) : (
            <Text>注销我的账户</Text>
          )}
        </Button>
      </View>
    </View>
  );
}
