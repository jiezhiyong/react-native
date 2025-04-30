import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function PickerScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  const languages = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
  ];

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">单项选择器</Text>
        <Text className="text-muted-foreground">单项选择器用于从预定义的选项列表中选择一个值。</Text>
      </View>

      {/* 语言选择器 */}
      <Text className="font-medium mb-2">选择编程语言</Text>
      <View className="bg-muted rounded-lg">
        <Picker selectedValue={selectedLanguage} onValueChange={(itemValue) => setSelectedLanguage(itemValue)}>
          {languages.map((language) => (
            <Picker.Item key={language.value} label={language.label} value={language.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
