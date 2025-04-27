import { GLView } from 'expo-gl';
import { Minus, Palette, Plus, RefreshCw, RotateCw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { create } from 'zustand';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Text } from '~/components/ui/text';

// GL状态管理
interface GLState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  rotationSpeed: number;
  setRotationSpeed: (speed: number) => void;
  resetGL: () => void;
}

const useGLStore = create<GLState>((set) => ({
  activeTab: 'triangle',
  setActiveTab: (tab) => set({ activeTab: tab }),
  rotationSpeed: 0.01,
  setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
  resetGL: () => set({ rotationSpeed: 0.01 }),
}));

// 旋转三角形组件
const RotatingTriangle: React.FC = () => {
  const { rotationSpeed } = useGLStore();
  const [context, setContext] = useState<WebGLRenderingContext | null>(null);
  const [rotation, setRotation] = useState(0);
  const [animationRequest, setAnimationRequest] = useState<number | null>(null);

  useEffect(() => {
    if (context) {
      const animate = () => {
        setRotation((r) => r + rotationSpeed);
        const req = requestAnimationFrame(animate);
        setAnimationRequest(req);
        return req;
      };

      animate();
      return () => {
        if (animationRequest) {
          cancelAnimationFrame(animationRequest);
        }
      };
    }
  }, [context, rotationSpeed, animationRequest]);

  useEffect(() => {
    if (context && rotation) {
      // 清除屏幕
      context.viewport(0, 0, context.drawingBufferWidth, context.drawingBufferHeight);
      context.clearColor(0, 0, 0, 1.0);
      context.clear(context.COLOR_BUFFER_BIT);

      // 创建着色器
      const vert = `
        attribute vec2 position;
        varying vec3 color;
        uniform float rotation;
        void main() {
          color = vec3(position.x, position.y, 1.0);
          mat2 rotationMatrix = mat2(
            cos(rotation), -sin(rotation),
            sin(rotation), cos(rotation)
          );
          vec2 rotatedPosition = rotationMatrix * position;
          gl_Position = vec4(rotatedPosition, 0.0, 1.0);
        }`;

      const frag = `
        precision mediump float;
        varying vec3 color;
        void main() {
          gl_FragColor = vec4(color, 1.0);
        }`;

      // 创建程序
      const program = context.createProgram()!;
      const vertexShader = context.createShader(context.VERTEX_SHADER)!;
      context.shaderSource(vertexShader, vert);
      context.compileShader(vertexShader);
      context.attachShader(program, vertexShader);

      const fragmentShader = context.createShader(context.FRAGMENT_SHADER)!;
      context.shaderSource(fragmentShader, frag);
      context.compileShader(fragmentShader);
      context.attachShader(program, fragmentShader);

      context.linkProgram(program);
      context.useProgram(program);

      // 创建缓冲区并绑定数据
      const buffer = context.createBuffer();
      context.bindBuffer(context.ARRAY_BUFFER, buffer);
      const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
      context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);

      // 获取属性位置并设置
      const positionAttrib = context.getAttribLocation(program, 'position');
      context.enableVertexAttribArray(positionAttrib);
      context.vertexAttribPointer(positionAttrib, 2, context.FLOAT, false, 0, 0);

      // 设置旋转角度
      const rotLoc = context.getUniformLocation(program, 'rotation');
      context.uniform1f(rotLoc, rotation);

      // 绘制三角形
      context.drawArrays(context.TRIANGLES, 0, 3);
      context.flush();
      // 使用 expo-gl 特定方法结束帧
      (context as any).endFrameEXP();
    }
  }, [context, rotation]);

  return (
    <View className="flex-1 items-center">
      <GLView style={{ width: 300, height: 300 }} onContextCreate={setContext} />
      <View className="flex-row items-center justify-center mt-4 space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onPress={() => {
            const store = useGLStore.getState();
            store.setRotationSpeed(Math.max(0.001, store.rotationSpeed - 0.005));
          }}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <View className="px-4">
          <Text className="text-center">旋转速度</Text>
        </View>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onPress={() => {
            const store = useGLStore.getState();
            store.setRotationSpeed(store.rotationSpeed + 0.005);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </View>
    </View>
  );
};

// 彩色矩形组件
const ColorfulRectangle: React.FC = () => {
  const [context, setContext] = useState<WebGLRenderingContext | null>(null);
  const [color, setColor] = useState({ r: 0.5, g: 0.5, b: 0.8 });
  const [paused, setPaused] = useState(false);

  // 随机生成颜色
  const generateRandomColor = () => {
    setColor({
      r: Math.random(),
      g: Math.random(),
      b: Math.random(),
    });
  };

  const drawRectangle = () => {
    if (!context) return;

    context.viewport(0, 0, context.drawingBufferWidth, context.drawingBufferHeight);
    context.clearColor(0, 0, 0, 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    // 创建着色器程序
    const vert = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }`;

    const frag = `
      precision mediump float;
      uniform vec3 color;
      void main() {
        gl_FragColor = vec4(color, 1.0);
      }`;

    // 创建程序
    const program = context.createProgram()!;
    const vertexShader = context.createShader(context.VERTEX_SHADER)!;
    context.shaderSource(vertexShader, vert);
    context.compileShader(vertexShader);
    context.attachShader(program, vertexShader);

    const fragmentShader = context.createShader(context.FRAGMENT_SHADER)!;
    context.shaderSource(fragmentShader, frag);
    context.compileShader(fragmentShader);
    context.attachShader(program, fragmentShader);

    context.linkProgram(program);
    context.useProgram(program);

    // 创建缓冲区并绑定矩形数据
    const buffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    const vertices = new Float32Array([-0.7, -0.7, 0.7, -0.7, 0.7, 0.7, -0.7, 0.7]);
    context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);

    // 获取属性位置并设置
    const positionAttrib = context.getAttribLocation(program, 'position');
    context.enableVertexAttribArray(positionAttrib);
    context.vertexAttribPointer(positionAttrib, 2, context.FLOAT, false, 0, 0);

    // 设置颜色
    const colorLoc = context.getUniformLocation(program, 'color');
    context.uniform3f(colorLoc, color.r, color.g, color.b);

    // 创建索引缓冲区
    const indexBuffer = context.createBuffer();
    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
    context.bufferData(context.ELEMENT_ARRAY_BUFFER, indices, context.STATIC_DRAW);

    // 绘制矩形
    context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0);
    context.flush();
    // 使用 expo-gl 特定方法结束帧
    (context as any).endFrameEXP();
  };

  useEffect(() => {
    drawRectangle();
  }, [context, color]);

  return (
    <View className="flex-1 items-center">
      <TouchableOpacity onPress={() => setPaused(!paused)}>
        <GLView style={{ width: 300, height: 300 }} onContextCreate={setContext} />
      </TouchableOpacity>
      <Text className="mt-2 text-secondary-foreground">点击画布{paused ? '继续' : '暂停'}动画</Text>
      <View className="flex-row items-center justify-center mt-4 space-x-2">
        <Button onPress={generateRandomColor} className="mt-2">
          <Palette className="mr-2 h-4 w-4" />
          <Text className="text-white">更换颜色</Text>
        </Button>
      </View>
    </View>
  );
};

// GL信息卡组件
const GLInfoCard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex-row items-center">
          <View className="mr-2 rounded-md bg-primary/10 p-2">
            <RotateCw className="h-5 w-5 text-primary" />
          </View>
          <Text>Expo GL</Text>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <View className="space-y-1">
          <Text className="text-xs text-secondary-foreground">• 提供 WebGL 渲染能力，适用于 2D 和 3D 图形渲染</Text>
          <Text className="text-xs text-secondary-foreground">• 可以创建各种图形、动画和游戏</Text>
          <Text className="text-xs text-secondary-foreground">• 与 React Native 集成，支持触摸交互</Text>
          <Text className="text-xs text-secondary-foreground">• 使用标准 WebGL API，支持各种 WebGL 库</Text>
        </View>
      </CardContent>
      <CardFooter>
        <Text className="text-xs text-muted-foreground">
          了解更多: https://docs.expo.dev/versions/latest/sdk/gl-view/
        </Text>
      </CardFooter>
    </Card>
  );
};

// 主组件
export default function ExpoGLScreen() {
  const { activeTab, setActiveTab, resetGL } = useGLStore();

  // 切换标签页
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-4">
        <Text className="text-2xl font-bold mb-2">Expo GL 示例</Text>
        <Text className="text-secondary-foreground mb-4">使用 OpenGL 在 React Native 中渲染 2D/3D 图形</Text>
      </View>

      <View className="mb-6">
        <Button variant="outline" className="mb-4" onPress={resetGL}>
          <RefreshCw className="mr-2 h-4 w-4" />
          <Text>重置 GL 设置</Text>
        </Button>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="triangle" className="flex-1">
              <Text>旋转三角形</Text>
            </TabsTrigger>
            <TabsTrigger value="rectangle" className="flex-1">
              <Text>彩色矩形</Text>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex-1">
              <Text>GL 信息</Text>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="triangle">
            <RotatingTriangle />
          </TabsContent>

          <TabsContent value="rectangle">
            <ColorfulRectangle />
          </TabsContent>

          <TabsContent value="info">
            <GLInfoCard />
            <Card>
              <CardHeader>
                <CardTitle>WebGL 着色器示例</CardTitle>
              </CardHeader>
              <CardContent>
                <View className="bg-muted p-4 rounded-md">
                  <Text className="text-xs font-mono text-secondary-foreground">// 顶点着色器</Text>
                  <Text className="text-xs font-mono text-secondary-foreground">attribute vec2 position;</Text>
                  <Text className="text-xs font-mono text-secondary-foreground">varying vec3 color;</Text>
                  <Text className="text-xs font-mono text-secondary-foreground">uniform float rotation;</Text>
                  <Text className="text-xs font-mono text-secondary-foreground">void main() {'{'}</Text>
                  <Text className="text-xs font-mono text-secondary-foreground">
                    {'  '}color = vec3(position.x, position.y, 1.0);
                  </Text>
                  <Text className="text-xs font-mono text-secondary-foreground">{'  '}mat2 rotationMatrix = mat2(</Text>
                  <Text className="text-xs font-mono text-secondary-foreground">
                    {'    '}cos(rotation), -sin(rotation),
                  </Text>
                  <Text className="text-xs font-mono text-secondary-foreground">
                    {'    '}sin(rotation), cos(rotation)
                  </Text>
                  <Text className="text-xs font-mono text-secondary-foreground">{'  '});</Text>
                  <Text className="text-xs font-mono text-secondary-foreground">
                    {'  '}vec2 rotatedPosition = rotationMatrix * position;
                  </Text>
                  <Text className="text-xs font-mono text-secondary-foreground">
                    {'  '}gl_Position = vec4(rotatedPosition, 0.0, 1.0);
                  </Text>
                  <Text className="text-xs font-mono text-secondary-foreground">{'}'}</Text>
                </View>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <View className="p-4 border border-border rounded-lg">
          <Text className="text-sm mb-2">注意事项：</Text>
          <Text className="text-xs text-secondary-foreground">• GL 在远程调试模式下可能无法正常工作</Text>
          <Text className="text-xs text-secondary-foreground">• 部分设备可能会有性能差异</Text>
          <Text className="text-xs text-secondary-foreground">• 请在实际设备上测试以获得最佳体验</Text>
        </View>
      </View>
    </ScrollView>
  );
}
