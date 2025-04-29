import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, View } from 'react-native';

import { toast } from '~/components/ui/sonner';

import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Text } from '../../components/ui/text';

export default function DateTimePickerScreen() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [dateTimeMode, setDateTimeMode] = useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = useState(true);

  // 日期变更处理
  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Android 取消选择时 selectedDate 为 undefined
    if (event.type === 'dismissed' || !selectedDate) {
      setShowPicker(false);
      return;
    }

    const currentDate = selectedDate;
    setShowPicker(Platform.OS === 'ios'); // iOS中保持打开，Android中关闭

    if (dateTimeMode === 'date') {
      setDate(currentDate);
      toast.success('日期已更新');
    } else {
      setTime(currentDate);
      toast.success('时间已更新');
    }
  };

  // 显示日期选择器
  const showDatePicker = () => {
    // Android平台使用命令式API
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        onChange: (e, selectedDate) => {
          if (selectedDate) {
            setDate(selectedDate);
            toast.success('日期已更新');
          }
        },
        mode: 'date',
      });
    }

    // iOS平台使用组件式API
    else {
      setDateTimeMode('date');
      setShowPicker(true);
    }
  };

  // 显示时间选择器
  const showTimePicker = () => {
    // Android平台使用命令式API
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: time,
        onChange: (e, selectedDate) => {
          if (selectedDate) {
            setTime(selectedDate);
            toast.success('时间已更新');
          }
        },
        mode: 'time',
        is24Hour: true,
      });
    }

    // iOS平台使用组件式API
    else {
      setDateTimeMode('time');
      setShowPicker(true);
    }
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 格式化时间
  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">日期时间选择器</Text>
        <Text className="text-secondary-foreground">实现交互式的日期和时间选择控件。</Text>
      </View>

      {/* 日期选择卡片 */}
      <Card className="p-4 mb-4">
        <Text className="font-medium mb-2">日期选择：{formatDate(date)}</Text>
        <Button onPress={showDatePicker} variant={dateTimeMode === 'date' ? 'default' : 'outline'}>
          <Text>选择日期</Text>
        </Button>
      </Card>

      {/* 时间选择卡片 */}
      <Card className="p-4 mb-4">
        <Text className="font-medium mb-2">时间选择：{formatTime(time)}</Text>
        <Button onPress={showTimePicker} variant={dateTimeMode === 'time' ? 'default' : 'outline'}>
          <Text>选择时间</Text>
        </Button>
      </Card>

      {/* iOS上的日期时间选择器组件 */}
      {showPicker && Platform.OS === 'ios' && (
        <View className="mt-4">
          <DateTimePicker
            testID="dateTimePicker"
            value={dateTimeMode === 'date' ? date : time}
            mode={dateTimeMode}
            minimumDate={dateTimeMode === 'date' ? new Date(2024, 0, 1) : new Date(2000, 0, 1)}
            maximumDate={dateTimeMode === 'date' ? new Date(2030, 0, 1) : new Date(2099, 0, 1)}
            minuteInterval={1}
            is24Hour={true}
            display="spinner"
            onChange={handleDateChange}
          />
        </View>
      )}
    </View>
  );
}
