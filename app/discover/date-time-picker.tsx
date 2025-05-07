import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, View } from 'react-native';

import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Text } from '../../components/ui/text';

export default function DateTimePickerScreen() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

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
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">日期时间选择器</Text>
        <Text className="text-muted-foreground">实现交互式的日期和时间选择控件。</Text>
      </View>

      {/* 日期选择卡片 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-2">日期选择：{formatDate(date)}</Text>

        {Platform.OS === 'android' && (
          <Button
            onPress={() => {
              DateTimePickerAndroid.open({
                value: date,
                mode: 'date',
                onChange: (e, selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                },
              });
            }}
          >
            <Text>选择日期</Text>
          </Button>
        )}

        {Platform.OS === 'ios' && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            minimumDate={new Date(2024, 0, 1)}
            maximumDate={new Date(2030, 0, 1)}
            display="spinner"
            onChange={(event, selectedDate?: Date) => {
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}
      </Card>

      {/* 时间选择卡片 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-2">时间选择：{formatTime(time)}</Text>

        {Platform.OS === 'android' && (
          <Button
            onPress={() => {
              DateTimePickerAndroid.open({
                value: time,
                mode: 'time',
                onChange: (e, selectedDate) => {
                  if (selectedDate) {
                    setTime(selectedDate);
                  }
                },
              });
            }}
          >
            <Text>选择时间</Text>
          </Button>
        )}

        {Platform.OS === 'ios' && (
          <DateTimePicker
            testID="dateTimePicker"
            value={time}
            mode="time"
            minimumDate={new Date(2024, 0, 1)}
            maximumDate={new Date(2030, 0, 1)}
            minuteInterval={1}
            is24Hour={true}
            display="spinner"
            onChange={(event, selectedDate?: Date) => {
              if (selectedDate) {
                setTime(selectedDate);
              }
            }}
          />
        )}
      </Card>
    </View>
  );
}
