import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronRight,
  User,
  Lock,
  Settings,
  PlusCircle,
  Info,
  FileText,
  HelpCircle,
  Heart,
  UserMinus,
  Database
} from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// 设置项目组件
interface SettingItemProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const SettingItem = ({ title, icon, onPress }: SettingItemProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={styles.settingItem}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        {icon}
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      <ChevronRight size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

// 设置组件
interface SettingGroupProps {
  children: React.ReactNode;
}

const SettingGroup = ({ children }: SettingGroupProps) => {
  return (
    <View style={styles.settingGroup}>
      {children}
    </View>
  );
};

export default function SettingScreen() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleItemPress = (title: string) => {
    console.log(`点击了: ${title}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 账户与安全 */}
        <SettingGroup>
          <SettingItem 
            title="账户管理" 
            icon={<User size={22} color="#6366f1" style={styles.itemIcon} />}
            onPress={() => handleItemPress("账户管理")} 
          />
          <SettingItem 
            title="隐私设置" 
            icon={<Lock size={22} color="#10b981" style={styles.itemIcon} />}
            onPress={() => handleItemPress("隐私设置")} 
          />
          <SettingItem 
            title="系统设置" 
            icon={<Settings size={22} color="#0ea5e9" style={styles.itemIcon} />}
            onPress={() => handleItemPress("系统设置")} 
          />
          <SettingItem 
            title="添加桌面小组件" 
            icon={<PlusCircle size={22} color="#f59e0b" style={styles.itemIcon} />}
            onPress={() => handleItemPress("添加桌面小组件")} 
          />
        </SettingGroup>

        {/* 关于与支持 */}
        <SettingGroup>
          <SettingItem 
            title="关于同程" 
            icon={<Info size={22} color="#8b5cf6" style={styles.itemIcon} />}
            onPress={() => handleItemPress("关于同程")} 
          />
          <SettingItem 
            title="营业执照" 
            icon={<FileText size={22} color="#6b7280" style={styles.itemIcon} />}
            onPress={() => handleItemPress("营业执照")} 
          />
          <SettingItem 
            title="帮助与反馈" 
            icon={<HelpCircle size={22} color="#ec4899" style={styles.itemIcon} />}
            onPress={() => handleItemPress("帮助与反馈")} 
          />
        </SettingGroup>

        {/* 辅助功能 */}
        <SettingGroup>
          <SettingItem 
            title="青少年模式" 
            icon={<Heart size={22} color="#ef4444" style={styles.itemIcon} />}
            onPress={() => handleItemPress("青少年模式")} 
          />
          <SettingItem 
            title="老年关怀模式" 
            icon={<UserMinus size={22} color="#f97316" style={styles.itemIcon} />}
            onPress={() => handleItemPress("老年关怀模式")} 
          />
        </SettingGroup>

        {/* 数据隐私 */}
        <SettingGroup>
          <SettingItem 
            title="个人信息收集与使用清单" 
            icon={<Database size={22} color="#6366f1" style={styles.itemIcon} />}
            onPress={() => handleItemPress("个人信息收集与使用清单")} 
          />
        </SettingGroup>

        {/* 底部空白区域 */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  settingGroup: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    color: '#333',
  },
});