import * as Calendar from 'expo-calendar';
import { CalendarIcon, Trash } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { cn } from '~/lib/utils';

import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

export default function ExpoCalendarScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar.Calendar | null>(null);
  const [events, setEvents] = useState<Calendar.Event[]>([]);

  // 获取日历权限
  const getCalendarPermissions = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        fetchCalendars();
      } else {
        setHasPermission(false);
        Alert.alert('权限被拒绝', '请在设置中开启日历权限才能使用该功能');
      }
    } catch (error) {
      console.error('获取权限失败：', error);
      Alert.alert('错误', '获取权限时出现错误');
    }
  };

  // 获取设备上的所有日历
  const fetchCalendars = async () => {
    try {
      const calendarsList = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      setCalendars(calendarsList);
    } catch (error) {
      console.error('获取日历失败：', error);
      Alert.alert('错误', '获取日历列表时出现错误');
    }
  };

  // 创建新日历
  const createCalendar = async () => {
    try {
      let defaultCalendarSource;
      if (Platform.OS === 'ios') {
        defaultCalendarSource = await getDefaultCalendarSource();
      }

      const newCalendarID = await Calendar.createCalendarAsync({
        title: `Expo 示例日历 ${new Date().toISOString().split('T')[0]}`,
        color: '#2196F3',
        entityType: Calendar.EntityTypes.EVENT,
        name: 'expoCalendarExample',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
        isVisible: Platform.OS === 'android' ? true : undefined,
        sourceId: Platform.OS === 'ios' ? defaultCalendarSource?.id : undefined,
        source: Platform.OS === 'ios' ? defaultCalendarSource : undefined,
      });

      Alert.alert('成功', `创建日历成功！ID: ${newCalendarID}`);
      fetchCalendars();
    } catch (error) {
      console.error('创建日历失败：', error);
      Alert.alert('错误', '创建日历时出现错误');
    }
  };

  // 获取默认日历源（仅iOS需要）
  const getDefaultCalendarSource = async () => {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendars = calendars.filter(
      (each) => each.source.name === 'iCloud' || each.source.name === 'Default'
    );
    return defaultCalendars.length > 0 ? defaultCalendars[0].source : calendars[0].source;
  };

  // 创建新事件
  const createEvent = async () => {
    if (!selectedCalendar) {
      Alert.alert('提示', '请先选择一个日历');
      return;
    }

    try {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1小时后

      const eventDetails = {
        title: `测试事件 ${new Date().toISOString().split('T')[0]}`,
        startDate,
        endDate,
        notes: '这是一个由 Expo Calendar API 创建的测试事件',
        location: '线上会议',
        timeZone: 'Asia/Shanghai',
        alarms: [
          {
            relativeOffset: -15, // 事件开始前15分钟提醒
          },
        ],
      };

      const eventId = await Calendar.createEventAsync(selectedCalendar.id, eventDetails);
      Alert.alert('成功', `事件创建成功！ID: ${eventId}`);
      fetchEvents(selectedCalendar.id);
    } catch (error) {
      console.error('创建事件失败：', error);
      Alert.alert('错误', '创建事件时出现错误');
    }
  };

  // 获取指定日历的所有事件
  const fetchEvents = async (calendarId: string) => {
    try {
      // 获取从今天开始一个月内的事件
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const events = await Calendar.getEventsAsync([calendarId], startDate, endDate);

      setEvents(
        events.map((event) => ({
          ...event,
          startDate: new Date(event.startDate).toLocaleString(),
          endDate: new Date(event.endDate).toLocaleString(),
        }))
      );
    } catch (error) {
      console.error('获取事件失败：', error);
      Alert.alert('错误', '获取事件列表时出现错误');
    }
  };

  // 选择日历并加载其事件
  const selectCalendar = (calendar: Calendar.Calendar) => {
    setSelectedCalendar(calendar);
    fetchEvents(calendar.id);
  };

  // 删除事件
  const deleteEvent = async (eventId: string) => {
    try {
      await Calendar.deleteEventAsync(eventId);
      Alert.alert('成功', '事件已删除');
      if (selectedCalendar) {
        fetchEvents(selectedCalendar.id);
      }
    } catch (error) {
      console.error('删除事件失败：', error);
      Alert.alert('错误', '删除事件时出现错误');
    }
  };

  // 组件挂载时请求权限
  useEffect(() => {
    getCalendarPermissions();
  }, []);

  if (hasPermission === null) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>正在请求日历权限...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg mb-4 text-center">需要日历权限才能使用此功能</Text>
        <Button onPress={getCalendarPermissions}>
          <Text>请求权限</Text>
        </Button>
      </View>
    );
  }

  return (
    <View>
      {/* 日历列表 */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">日历列表</Text>
        <Button size="sm" onPress={createCalendar}>
          <Text>创建日历</Text>
        </Button>
      </View>

      {calendars.length === 0 ? (
        <View className="p-4 bg-gray-100 rounded-lg">
          <Text className="text-center text-gray-500">暂无日历</Text>
        </View>
      ) : (
        calendars.map((calendar) => (
          <TouchableOpacity key={calendar.id} onPress={() => selectCalendar(calendar)}>
            <View
              className={cn('p-3 mb-2 rounded-lg border border-gray-200 flex-row items-center gap-2', {
                'bg-blue-50 border-blue-300': selectedCalendar?.id === calendar.id,
                'bg-white border-gray-200': selectedCalendar?.id !== calendar.id,
              })}
            >
              <View style={{ backgroundColor: calendar.color }} className="h-6 w-6 rounded-full" />
              <View className="flex-1">
                <Text className="font-medium">{calendar.title}</Text>
                <Text className="text-xs text-gray-500">{calendar.source.name}</Text>
              </View>
              {calendar.allowsModifications === false && <Text className="text-xs text-orange-500">只读</Text>}
              <CalendarIcon size={20} />
            </View>
          </TouchableOpacity>
        ))
      )}

      <View className="flex-row justify-between items-center mb-2 mt-6">
        <Text className="text-lg font-semibold">事件列表</Text>
        <Button onPress={createEvent} size="sm" disabled={!selectedCalendar}>
          <Text>创建事件</Text>
        </Button>
      </View>
      {selectedCalendar ? null : <Text>请先选择一个日历</Text>}

      {/* 事件列表 */}
      {selectedCalendar && (
        <View>
          {events.length === 0 ? (
            <Text>暂无事件</Text>
          ) : (
            events.map((event) => (
              <View key={event.id} className="p-3 mb-2 rounded-lg bg-white border border-gray-200">
                <View className="flex-row justify-between">
                  <Text className="font-medium">{event.title}</Text>
                  <Button
                    onPress={() => deleteEvent(event.id)}
                    size="icon"
                    variant="ghost"
                    disabled={selectedCalendar?.allowsModifications === false}
                  >
                    <Trash color="red" size={20} />
                  </Button>
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                  {event.allDay ? '全天事件' : `时间: ${event.startDate} - ${event.endDate}`}
                </Text>
                {event.location && <Text className="text-xs text-gray-600 mt-1">地点: {event.location}</Text>}
                {event.notes && <Text className="text-xs text-gray-600 mt-1">备注: {event.notes}</Text>}
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
}
