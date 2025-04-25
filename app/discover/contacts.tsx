import * as Contacts from 'expo-contacts';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

import { toast } from '~/components/ui/sonner';

import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Text } from '../../components/ui/text';

// 联系人类型定义
type ContactItem = {
  id: string;
  name: string;
  phoneNumbers?: {
    id?: string;
    label?: string;
    number?: string;
  }[];
};

export default function ExpoContactsScreen() {
  // 状态管理
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 请求联系人权限
  const requestContactsPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        toast.success('成功获取通讯录权限');
        fetchContacts();
      } else {
        toast.error('未获得通讯录权限');
      }
    } catch (error) {
      console.error('请求权限出错:', error);
      toast.error('请求权限失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取联系人数据
  const fetchContacts = async () => {
    setLoading(true);
    try {
      // 获取联系人数据，仅请求姓名和电话号码
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        sort: Contacts.SortTypes.FirstName,
      });

      if (data.length > 0) {
        // 数据处理和过滤，只保留有名字的联系人
        const filteredContacts = data
          .filter((contact) => contact.name && contact.id)
          .map((contact) => ({
            id: contact.id!,
            name: contact.name || '未知',
            phoneNumbers: contact.phoneNumbers,
          }));

        setContacts(filteredContacts);
        toast.success(`成功获取 ${filteredContacts.length} 个联系人`);
      } else {
        setContacts([]);
        toast.info('未找到联系人');
      }
    } catch (error) {
      console.error('获取联系人数据出错:', error);
      toast.error('获取联系人失败');
    } finally {
      setLoading(false);
    }
  };

  // 清空联系人列表
  const clearContacts = () => {
    setContacts([]);
  };

  // 渲染单个联系人
  const renderContactItem = ({ item }: { item: ContactItem }) => (
    <Card className="mb-2 p-3 bg-card">
      <Text className="text-foreground font-medium">{item.name}</Text>
      {item.phoneNumbers && item.phoneNumbers.length > 0 ? (
        item.phoneNumbers.map((phone, index) => (
          <View key={phone.id || index} className="mt-1">
            <Text className="text-secondary-foreground text-sm">
              {phone.label}: {phone.number}
            </Text>
          </View>
        ))
      ) : (
        <Text className="text-secondary-foreground text-sm mt-1">没有电话号码</Text>
      )}
    </Card>
  );

  return (
    <View className="flex-1">
      <View className="mb-6">
        <Text className="text-xl font-semibold text-foreground mb-2">Expo Contacts 示例</Text>
        <Text className="text-secondary-foreground mb-4">
          此示例展示了如何使用 expo-contacts 来获取设备通讯录中的联系人信息。
        </Text>

        <View className="flex-row mb-4">
          <Button onPress={requestContactsPermission} className="mr-2" disabled={loading}>
            <Text className="text-button-foreground">{hasPermission ? '重新获取联系人' : '请求联系人权限'}</Text>
          </Button>

          {contacts.length > 0 && (
            <Button variant="destructive" onPress={clearContacts} disabled={loading}>
              <Text className="text-destructive-foreground">清空列表</Text>
            </Button>
          )}
        </View>

        {loading ? (
          <Text className="text-secondary-foreground">正在加载联系人...</Text>
        ) : hasPermission === false ? (
          <Card className="p-4 bg-muted">
            <Text className="text-foreground">需要获取通讯录权限才能使用此功能</Text>
          </Card>
        ) : contacts.length > 0 ? (
          <FlatList
            data={contacts}
            renderItem={renderContactItem}
            keyExtractor={(item) => item.id}
            className="mb-4"
            ListHeaderComponent={<Text className="text-secondary-foreground mb-2">共 {contacts.length} 个联系人</Text>}
          />
        ) : hasPermission ? (
          <Card className="p-4 bg-muted">
            <Text className="text-foreground">未找到联系人数据</Text>
          </Card>
        ) : null}
      </View>
    </View>
  );
}
