import * as Audio from 'expo-audio';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Camera, Image as ImageIcon, Mic, Play, Plus, Send, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { ActivityIndicator } from '@/components/ActivityIndicator';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

const PLAYBACK_STATUS_UPDATE = 'playbackStatusUpdate';

// 消息类型定义
type MessageType = 'text' | 'image' | 'video' | 'system';

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  sender: 'user' | 'agent' | 'system';
  mediaUrl?: string; // 用于图片或视频URL
  thumbnailUrl?: string; // 视频缩略图
}

// 常见问题定义
interface QuickQuestion {
  id: string;
  question: string;
}

// 客服状态管理
interface CustomerServiceStore {
  messages: Message[];
  isChatting: boolean;
  isLoading: boolean;
  agentName: string;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  startChat: () => void;
  simulateAgentReply: (content: string, type?: MessageType, mediaUrl?: string) => void;
}

const useCustomerServiceStore = create<CustomerServiceStore>((set, get) => ({
  messages: [],
  isChatting: false,
  isLoading: false,
  agentName: '客服小助手',

  addMessage: (message) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...message,
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    // 播放新消息声音（如果是代理发送的消息）
    if (message.sender === 'agent') {
      playNewMessageSound();
    }
  },

  startChat: () => {
    set({ isChatting: true });

    // 添加系统欢迎消息，如果重复进入页面，不重复显示
    if (get().messages.length === 0) {
      const welcomeMessage: Omit<Message, 'id' | 'timestamp'> = {
        content: `您好，我是${get().agentName}，很高兴为您服务。`,
        type: 'text',
        sender: 'agent',
      };

      get().addMessage(welcomeMessage);
    }
  },

  simulateAgentReply: (content, type = 'text', mediaUrl) => {
    set({ isLoading: true });

    // 模拟网络延迟
    setTimeout(() => {
      const agentMessage: Omit<Message, 'id' | 'timestamp'> = {
        content,
        type,
        sender: 'agent',
        mediaUrl,
      };

      get().addMessage(agentMessage);
      set({ isLoading: false });
    }, 1000);
  },
}));

// 快捷问题列表
const quickQuestions: QuickQuestion[] = [
  { id: 'q1', question: '如何修改配送地址？' },
  { id: 'q2', question: '订单退款需要多长时间？' },
  { id: 'q3', question: '如何查询物流信息？' },
  { id: 'q4', question: '支持哪些支付方式？' },
  { id: 'q5', question: '商品破损了怎么办？' },
];

// 播放新消息提示音
async function playNewMessageSound() {
  try {
    // 创建一个音频播放器
    const player = Audio.createAudioPlayer(require('@/assets/audios/received-message.mp3'));

    // 监听播放完成事件, 播放完成后释放资源
    const subscribe = player.addListener(PLAYBACK_STATUS_UPDATE, (status: Audio.AudioStatus) => {
      if (status.didJustFinish) {
        player.release();
        subscribe.remove();
      }
    });

    // 播放系统默认提示音
    await player.play();
  } catch (error) {
    console.error(`播放提示音失败: ${(error as Error)?.message}`);
  }
}

// 消息气泡组件
const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  const router = useRouter();

  // 处理图片点击查看
  const handleMediaPress = () => {
    if (message.mediaUrl && (message.type === 'image' || message.type === 'video')) {
      router.push({
        pathname: '/media-viewer',
        params: { url: message.mediaUrl, type: message.type },
      });
    }
  };

  if (isSystem) {
    return (
      <View className="my-2 px-5 py-3 rounded-lg self-center bg-muted/50">
        <Text className="text-sm text-muted-foreground">{message.content}</Text>
      </View>
    );
  }

  return (
    <View className={`flex-row max-w-[85%] my-2 ${isUser ? 'self-end' : 'self-start'}`}>
      {!isUser && <Image source={require('@/assets/images/icon.png')} className="size-10 rounded-full mr-3" />}

      <View className={`p-4 rounded-3xl ${isUser ? 'bg-primary/15 rounded-tr-none' : 'bg-card rounded-tl-none'}`}>
        {message.type === 'text' && <Text>{message.content}</Text>}

        {message.type === 'image' && message.mediaUrl && (
          <TouchableOpacity onPress={handleMediaPress} activeOpacity={0.8}>
            <Image source={{ uri: message.mediaUrl }} className="w-48 h-48 rounded-md" contentFit="cover" />
          </TouchableOpacity>
        )}

        {message.type === 'video' && message.mediaUrl && (
          <TouchableOpacity onPress={handleMediaPress} activeOpacity={0.8}>
            <View className="relative w-48 h-48 rounded-md overflow-hidden">
              {message.thumbnailUrl ? (
                <Image source={{ uri: message.thumbnailUrl }} className="w-full h-full" contentFit="cover" />
              ) : (
                <View className="w-full h-full bg-muted items-center justify-center">
                  <ActivityIndicator color="#c96442" />
                </View>
              )}
              <View className="absolute inset-0 items-center justify-center bg-black/20">
                <View className="w-12 h-12 rounded-full bg-background/50 items-center justify-center">
                  <Play color="#141413" size={24} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <Text className={`text-sm mt-1 text-muted-foreground`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </Text>
      </View>

      {isUser && <Image source={require('@/assets/images/avatar.jpg')} className="size-10 rounded-full ml-3" />}
    </View>
  );
};

// 快捷问题按钮组件
const QuickQuestionButton = ({ question, onPress }: { question: QuickQuestion; onPress: () => void }) => {
  return (
    <TouchableOpacity
      className="bg-card border border-border rounded-full px-4 py-2"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text className="text-sm text-foreground" numberOfLines={1}>
        {question.question}
      </Text>
    </TouchableOpacity>
  );
};

// 媒体选择器组件
const MediaPicker = ({
  isVisible,
  onClose,
  onSelectMedia,
}: {
  isVisible: boolean;
  onClose: () => void;
  onSelectMedia: (uri: string, type: 'image' | 'video') => void;
}) => {
  // 处理选择图片
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onSelectMedia(result.assets[0].uri, 'image');
        onClose();
      }
    } catch (error) {
      console.error('选择图片失败:', error);
    }
  };

  // 处理选择视频
  const handlePickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onSelectMedia(result.assets[0].uri, 'video');
        onClose();
      }
    } catch (error) {
      console.error('选择视频失败:', error);
    }
  };

  // 处理拍照
  const handleTakePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        console.log('需要相机权限才能拍照');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onSelectMedia(result.assets[0].uri, 'image');
        onClose();
      }
    } catch (error) {
      console.error('拍照失败:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View className="flex-1 justify-end shadow-md">
        <View className="bg-card rounded-t-3xl p-5 border border-border">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-medium">选择媒体</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <X size={24} color="#87867f" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-around text-primary">
            <TouchableOpacity className="items-center" onPress={handleTakePhoto}>
              <View className="w-14 h-14 rounded-full bg-primary/20 items-center justify-center mb-2">
                <Camera size={28} />
              </View>
              <Text className="text-foreground">拍照</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={handlePickImage}>
              <View className="w-14 h-14 rounded-full bg-primary/20 items-center justify-center mb-2">
                <ImageIcon size={28} />
              </View>
              <Text className="text-foreground">图片</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={handlePickVideo}>
              <View className="w-14 h-14 rounded-full bg-primary/20 items-center justify-center mb-2">
                <Mic size={28} />
              </View>
              <Text className="text-foreground">视频</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function OnlineServiceScreen() {
  const [inputText, setInputText] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { messages, isLoading, addMessage, startChat, simulateAgentReply } = useCustomerServiceStore();

  // 初始化聊天
  useEffect(() => {
    startChat();

    // 请求权限
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();

    return () => {
      // 清理工作
    };
  }, [addMessage, startChat]);

  // 当消息列表变化时，滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // 发送文本消息
  const sendTextMessage = useCallback(() => {
    if (!inputText.trim()) return;

    // 添加用户消息
    addMessage({
      content: inputText.trim(),
      type: 'text',
      sender: 'user',
    });

    setInputText('');

    // 模拟客服回复
    simulateAgentReply(
      `感谢您的咨询。关于"${inputText.trim().substring(0, 20)}${inputText.trim().length > 20 ? '...' : ''}"的问题，我们会尽快处理。`
    );
  }, [inputText, addMessage, simulateAgentReply]);

  // 处理媒体选择
  const handleMediaSelect = async (uri: string, type: 'image' | 'video') => {
    // 添加用户媒体消息
    const mediaMessage: Omit<Message, 'id' | 'timestamp'> = {
      content: type === 'image' ? '图片' : '视频',
      type,
      sender: 'user',
      mediaUrl: uri,
    };

    // 如果是视频，生成缩略图
    if (type === 'video') {
      try {
        const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(uri, {
          time: 0,
        });
        mediaMessage.thumbnailUrl = thumbnailUri;
      } catch (error) {
        console.error('生成视频缩略图失败:', error);
      }
    }

    addMessage(mediaMessage);

    // 模拟客服回复
    simulateAgentReply(type === 'image' ? '我已收到您发送的图片，正在查看。' : '我已收到您发送的视频，正在查看。');
  };

  // 处理快捷问题点击
  const handleQuickQuestionPress = (question: string) => {
    // 添加用户问题
    addMessage({
      content: question,
      type: 'text',
      sender: 'user',
    });

    // 根据问题模拟客服回答
    let reply = '';
    switch (question) {
      case '如何修改配送地址？':
        reply = '您可以在"我的-订单详情"中，点击"修改地址"进行修改。注意：订单发货后将无法修改地址。';
        break;
      case '订单退款需要多长时间？':
        reply = '退款审核通过后，退款将原路返回，预计1-7个工作日到账，具体以银行处理时间为准。';
        break;
      case '如何查询物流信息？':
        reply = '您可以在"我的-订单-订单详情"中查看物流信息，或使用物流单号在快递官网查询。';
        break;
      case '支持哪些支付方式？':
        reply = '我们目前支持支付宝、微信支付、银联卡支付和Apple Pay等多种支付方式。';
        break;
      case '商品破损了怎么办？':
        reply = '请拍摄商品破损照片，前往"我的-订单-申请售后"提交售后申请，我们会优先处理您的问题。';
        break;
      default:
        reply = '感谢您的咨询，我们会尽快为您解答。';
    }

    simulateAgentReply(reply);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          title: '在线客服',
        }}
      />

      {/* 常见问题快捷入口 */}
      <View className="px-5 py-2 pt-5">
        <Text className="font-medium mb-3">常见问题：</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row items-center gap-3">
            {quickQuestions.map((q) => (
              <QuickQuestionButton key={q.id} question={q} onPress={() => handleQuickQuestionPress(q.question)} />
            ))}
          </View>
        </ScrollView>
      </View>

      <SafeAreaView className="flex-1">
        {/* 聊天区域 */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        />

        {/* 加载指示器 */}
        {isLoading && (
          <View className="py-3 px-4 rounded-lg flex-row items-center justify-center">
            <ActivityIndicator size="small" color="#c96442" />
            <Text className="ml-2 text-muted-foreground text-sm">正在输入 ...</Text>
          </View>
        )}

        {/* 输入框区域 */}
        <View className="px-5 py-3 border-t border-border flex-row items-center bg-background">
          <TouchableOpacity className="mr-2 p-2" onPress={() => setShowMediaPicker(true)}>
            <Plus size={24} />
          </TouchableOpacity>

          <View className="flex-1 bg-muted rounded-full px-2">
            <Input
              className="border-0 bg-transparent"
              placeholder="请输入消息..."
              value={inputText}
              onChangeText={setInputText}
            />
          </View>

          <TouchableOpacity
            className={`ml-3 p-2 rounded-full size-10 justify-center ${inputText.trim() ? 'bg-primary' : 'bg-muted'}`}
            onPress={sendTextMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color="#faf9f5" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* 媒体选择器 */}
      <MediaPicker
        isVisible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelectMedia={handleMediaSelect}
      />
    </KeyboardAvoidingView>
  );
}
