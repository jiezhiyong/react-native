import {
  CalendarAccessLevel,
  createCalendar,
  EntityTypes,
  type ExpoCalendar,
  ExpoCalendarEvent,
  getCalendars,
  requestCalendarPermissions,
} from 'expo-calendar';
import { PermissionStatus } from 'expo-modules-core';
import { CalendarIcon, Trash } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { cn } from '@/lib/utils';

import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

type DisplayEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  location?: string;
  notes?: string;
};

export default function ExpoCalendarScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [calendars, setCalendars] = useState<ExpoCalendar[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<ExpoCalendar | null>(null);
  const [events, setEvents] = useState<DisplayEvent[]>([]);

  const getCalendarPermissions = async () => {
    try {
      const { status } = await requestCalendarPermissions();
      if (status === PermissionStatus.GRANTED) {
        setHasPermission(true);
        await fetchCalendars();
      } else {
        setHasPermission(false);
        Alert.alert('权限被拒绝', '请在设置中开启日历权限才能使用该功能');
      }
    } catch (error) {
      console.error('获取权限失败：', error);
      Alert.alert('错误', '获取权限时出现错误');
    }
  };

  const fetchCalendars = async () => {
    try {
      const calendarsList = await getCalendars(EntityTypes.EVENT);
      setCalendars(calendarsList);
      if (calendarsList.length > 0) {
        setSelectedCalendar(calendarsList[0]);
        await fetchEvents(calendarsList[0]);
      }
    } catch (error) {
      console.error('获取日历失败：', error);
      Alert.alert('错误', '获取日历列表时出现错误');
    }
  };

  const createNewCalendar = async () => {
    try {
      let defaultCalendarSource;
      if (Platform.OS === 'ios') {
        defaultCalendarSource = await getDefaultCalendarSource();
      }

      const newCalendar = await createCalendar({
        title: `Expo 示例日历 ${new Date().toISOString().split('T')[0]}`,
        color: '#2196F3',
        entityType: EntityTypes.EVENT,
        name: 'expoCalendarExample',
        ownerAccount: 'personal',
        accessLevel: CalendarAccessLevel.OWNER,
        isVisible: Platform.OS === 'android' ? true : undefined,
        sourceId: Platform.OS === 'ios' ? defaultCalendarSource?.id : undefined,
        source: Platform.OS === 'ios' ? defaultCalendarSource : undefined,
      });

      Alert.alert('成功', `创建日历成功！ID: ${newCalendar.id}`);
      await fetchCalendars();
    } catch (error) {
      console.error('创建日历失败：', error);
      Alert.alert('错误', (error as Error).message);
    }
  };

  const getDefaultCalendarSource = async () => {
    const allCalendars = await getCalendars(EntityTypes.EVENT);
    const defaultCalendars = allCalendars.filter(
      (each) => each.source.name === 'iCloud' || each.source.name === 'Default'
    );
    return defaultCalendars.length > 0 ? defaultCalendars[0].source : allCalendars[0].source;
  };

  const createEvent = async () => {
    if (!selectedCalendar) {
      Alert.alert('提示', '请先选择一个日历');
      return;
    }

    try {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

      const event = await selectedCalendar.createEvent({
        title: `测试事件 ${new Date().toISOString().split('T')[0]}`,
        startDate,
        endDate,
        notes: '这是一个由 Expo Calendar API 创建的测试事件',
        location: '线上会议',
        timeZone: 'Asia/Shanghai',
        alarms: [{ relativeOffset: -15 }],
      });

      Alert.alert('成功', `事件创建成功！ID: ${event.id}`);
      await fetchEvents(selectedCalendar);
    } catch (error) {
      console.error('创建事件失败：', error);
      Alert.alert('错误', (error as Error).message);
    }
  };

  const toDisplayEvent = (event: ExpoCalendarEvent): DisplayEvent => ({
    id: event.id,
    title: event.title,
    startDate: new Date(event.startDate).toLocaleString(),
    endDate: new Date(event.endDate).toLocaleString(),
    allDay: event.allDay,
    location: event.location ?? undefined,
    notes: event.notes ?? undefined,
  });

  const fetchEvents = async (calendar: ExpoCalendar) => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const calendarEvents = await calendar.listEvents(startDate, endDate);
      setEvents(calendarEvents.map(toDisplayEvent));
    } catch (error) {
      console.error('获取事件失败：', error);
      Alert.alert('错误', '获取事件列表时出现错误');
    }
  };

  const selectCalendar = (calendar: ExpoCalendar) => {
    setSelectedCalendar(calendar);
    void fetchEvents(calendar);
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const event = await ExpoCalendarEvent.get(eventId);
      await event.delete();
      Alert.alert('成功', '事件已删除');
      if (selectedCalendar) {
        await fetchEvents(selectedCalendar);
      }
    } catch (error) {
      console.error('删除事件失败：', error);
      Alert.alert('错误', '删除事件时出现错误');
    }
  };

  useEffect(() => {
    void getCalendarPermissions();
  }, []);

  if (hasPermission === false) {
    return (
      <View className="flex-1 p-5 m-6 items-center justify-center bg-muted rounded-lg">
        <Text className="mb-6 text-center">需要日历权限才能使用此功能</Text>
        <Button onPress={getCalendarPermissions}>
          <Text>请求权限</Text>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">日历功能</Text>
        <Text className="text-muted-foreground">访问和管理设备上的日历事件和提醒。</Text>
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-medium">日历列表</Text>
        <Button size="sm" onPress={createNewCalendar}>
          <Text>创建日历</Text>
        </Button>
      </View>

      {calendars.length === 0 ? (
        <View className="p-4 bg-muted rounded-lg">
          <Text className="text-center text-muted-foreground">暂无日历</Text>
        </View>
      ) : (
        calendars.map((calendar) => (
          <TouchableOpacity key={calendar.id} onPress={() => selectCalendar(calendar)}>
            <View
              className={cn('p-3 mb-2 rounded-lg border border-border flex-row items-center gap-3', {
                'bg-primary/10 border-primary/30': selectedCalendar?.id === calendar.id,
                'bg-background border-border': selectedCalendar?.id !== calendar.id,
              })}
            >
              <View style={{ backgroundColor: calendar.color }} className="h-6 w-6 rounded-full" />
              <View className="flex-1">
                <Text className="font-medium">{calendar.title}</Text>
                <Text className="text-xs text-muted-foreground">{calendar.source.name}</Text>
              </View>
              {calendar.allowsModifications === false && <Text className="text-xs text-orange-500">只读</Text>}
              <CalendarIcon size={20} />
            </View>
          </TouchableOpacity>
        ))
      )}

      <View className="flex-row justify-between items-center mb-2 mt-6">
        <Text className="text-lg font-medium">事件列表</Text>
        <Button onPress={createEvent} size="sm" disabled={!selectedCalendar}>
          <Text>创建事件</Text>
        </Button>
      </View>

      {selectedCalendar && (
        <View>
          {events.length === 0 ? (
            <Text>暂无事件</Text>
          ) : (
            events.map((event) => (
              <View key={event.id} className="px-3 pt-1 pb-3 mb-2 rounded-lg bg-background border border-border">
                <View className="flex-row justify-between items-center">
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
                <Text className="text-xs text-muted-foreground">
                  {event.allDay ? '全天事件' : `时间: ${event.startDate} - ${event.endDate}`}
                </Text>
                {event.location && <Text className="text-xs text-muted-foreground mt-1">地点: {event.location}</Text>}
                {event.notes && <Text className="text-xs text-muted-foreground mt-1">备注: {event.notes}</Text>}
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}
