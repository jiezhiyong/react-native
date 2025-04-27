import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  AmbientLight,
  BoxGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
  TorusGeometry,
} from 'three';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Text } from '~/components/ui/text';

export default function GLScreen() {
  const [currentShape, setCurrentShape] = useState<'box' | 'torus'>('box');
  const [rotationSpeed, setRotationSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');

  // 创建3D场景
  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    // 创建three.js渲染器
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor('#000');

    // 创建场景
    const scene = new Scene();
    scene.fog = new Fog('#000', 1, 10000);

    // 创建透视相机
    const camera = new PerspectiveCamera(
      75, // 视野角度
      gl.drawingBufferWidth / gl.drawingBufferHeight, // 宽高比
      0.1, // 近截面
      1000 // 远截面
    );
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    // 添加光源
    const ambientLight = new AmbientLight(0x404040); // 环境光
    scene.add(ambientLight);

    const spotLight = new SpotLight(0xffffff, 1); // 聚光灯
    spotLight.position.set(5, 5, 5);
    spotLight.lookAt(0, 0, 0);
    scene.add(spotLight);

    const pointLight = new PointLight(0xffffff, 1); // 点光源
    pointLight.position.set(-5, 3, 5);
    scene.add(pointLight);

    // 创建网格地面
    const gridHelper = new GridHelper(10, 10);
    scene.add(gridHelper);

    // 创建几何体
    let mesh: Mesh;
    if (currentShape === 'box') {
      // 创建立方体
      const geometry = new BoxGeometry(1.5, 1.5, 1.5);
      const material = new MeshStandardMaterial({
        color: 0x3b82f6, // 蓝色
        metalness: 0.5,
        roughness: 0.5,
      });
      mesh = new Mesh(geometry, material);
    } else {
      // 创建圆环
      const geometry = new TorusGeometry(1, 0.4, 16, 100);
      const material = new MeshStandardMaterial({
        color: 0xef4444, // 红色
        metalness: 0.5,
        roughness: 0.5,
      });
      mesh = new Mesh(geometry, material);
    }
    scene.add(mesh);

    // 动画速度映射
    const speedMap = {
      slow: 0.01,
      medium: 0.03,
      fast: 0.05,
    };

    // 渲染循环
    const render = () => {
      requestAnimationFrame(render);

      // 旋转网格
      mesh.rotation.x += speedMap[rotationSpeed];
      mesh.rotation.y += speedMap[rotationSpeed];

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <ScrollView className="flex-1 p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3D图形示例</CardTitle>
          <CardDescription>使用Expo GL和Three.js创建3D图形</CardDescription>
        </CardHeader>
        <CardContent>
          <View className="h-80 w-full mb-4 overflow-hidden rounded-lg bg-gray-900">
            <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
          </View>

          <Text className="text-lg font-bold mb-2">控制面板</Text>
          <Separator className="my-4" />

          <Text className="font-medium mb-2">选择形状：</Text>
          <View className="flex-row space-x-2 mb-4">
            <Button
              className={currentShape === 'box' ? 'bg-primary' : 'bg-secondary'}
              onPress={() => setCurrentShape('box')}
            >
              <Text className={currentShape === 'box' ? 'text-primary-foreground' : 'text-secondary-foreground'}>
                立方体
              </Text>
            </Button>
            <Button
              className={currentShape === 'torus' ? 'bg-primary' : 'bg-secondary'}
              onPress={() => setCurrentShape('torus')}
            >
              <Text className={currentShape === 'torus' ? 'text-primary-foreground' : 'text-secondary-foreground'}>
                圆环
              </Text>
            </Button>
          </View>

          <Text className="font-medium mb-2">旋转速度：</Text>
          <View className="flex-row space-x-2">
            <Button
              className={rotationSpeed === 'slow' ? 'bg-primary' : 'bg-secondary'}
              onPress={() => setRotationSpeed('slow')}
            >
              <Text className={rotationSpeed === 'slow' ? 'text-primary-foreground' : 'text-secondary-foreground'}>
                慢速
              </Text>
            </Button>
            <Button
              className={rotationSpeed === 'medium' ? 'bg-primary' : 'bg-secondary'}
              onPress={() => setRotationSpeed('medium')}
            >
              <Text className={rotationSpeed === 'medium' ? 'text-primary-foreground' : 'text-secondary-foreground'}>
                中速
              </Text>
            </Button>
            <Button
              className={rotationSpeed === 'fast' ? 'bg-primary' : 'bg-secondary'}
              onPress={() => setRotationSpeed('fast')}
            >
              <Text className={rotationSpeed === 'fast' ? 'text-primary-foreground' : 'text-secondary-foreground'}>
                快速
              </Text>
            </Button>
          </View>
        </CardContent>
        <CardFooter>
          <Text className="text-sm text-secondary-foreground">
            注意：3D渲染会消耗较多的设备资源，可能会影响设备电池寿命。
          </Text>
        </CardFooter>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>技术说明</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-base mb-2">这个示例使用了以下技术：</Text>

          <Text className="font-bold mt-2">1. Expo GL</Text>
          <Text className="text-sm text-secondary-foreground ml-4 mb-1">
            提供OpenGL对象和上下文，使React Native能够访问底层图形API。
          </Text>

          <Text className="font-bold mt-2">2. Three.js</Text>
          <Text className="text-sm text-secondary-foreground ml-4 mb-1">
            JavaScript 3D库，简化了WebGL的使用，提供了丰富的3D对象和功能。
          </Text>

          <Text className="font-bold mt-2">3. 主要组件</Text>
          <Text className="text-sm text-secondary-foreground ml-4 mb-1">- Scene：场景，所有3D对象的容器</Text>
          <Text className="text-sm text-secondary-foreground ml-4 mb-1">- Camera：相机，定义观察角度和视野</Text>
          <Text className="text-sm text-secondary-foreground ml-4 mb-1">- Mesh：网格，由几何体和材质组成</Text>
          <Text className="text-sm text-secondary-foreground ml-4 mb-1">- Light：光源，提供场景照明</Text>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
