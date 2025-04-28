import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PickerScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const languages = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
  ];

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const getLanguageLabel = (value: string) => {
    const language = languages.find((lang) => lang.value === value);
    return language ? language.label : '未知';
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">选择器示例</Text>
        <Text className="text-gray-600 mb-4">此功能展示了不同类型的系统选择器，包括日期选择器和选项选择器。</Text>
      </View>

      <View className="space-y-6">
        {/* 日期选择器 */}
        <View className="p-4 bg-gray-100 rounded-lg">
          <Text className="text-base mb-2">选择日期</Text>
          <TouchableOpacity
            className="bg-white p-4 rounded-lg flex-row items-center justify-between"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-lg">{date.toLocaleDateString('zh-CN')}</Text>
            <Ionicons name="calendar" size={20} color="gray" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
            />
          )}
        </View>

        {/* 语言选择器 */}
        <View className="p-4 bg-gray-100 rounded-lg">
          <Text className="text-base mb-2">选择编程语言</Text>
          {Platform.OS === 'ios' ? (
            <TouchableOpacity
              className="bg-white p-4 rounded-lg flex-row items-center justify-between"
              onPress={() => setShowLanguagePicker(!showLanguagePicker)}
            >
              <Text className="text-lg">{getLanguageLabel(selectedLanguage)}</Text>
              <Ionicons name="chevron-down" size={20} color="gray" />
            </TouchableOpacity>
          ) : (
            <View className="bg-white rounded-lg">
              <Picker selectedValue={selectedLanguage} onValueChange={(itemValue) => setSelectedLanguage(itemValue)}>
                {languages.map((language) => (
                  <Picker.Item key={language.value} label={language.label} value={language.value} />
                ))}
              </Picker>
            </View>
          )}

          {showLanguagePicker && Platform.OS === 'ios' && (
            <View className="mt-2 bg-white rounded-lg">
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.value}
                  className="p-4 border-b border-gray-200"
                  onPress={() => {
                    setSelectedLanguage(language.value);
                    setShowLanguagePicker(false);
                  }}
                >
                  <Text className="text-lg">{language.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 日期选择器在不同平台上的显示方式不同
          {'\n'}2. iOS 上的选择器使用自定义实现
          {'\n'}3. Android 上的选择器使用系统原生组件
        </Text>
      </View>
    </ScrollView>
  );
}
