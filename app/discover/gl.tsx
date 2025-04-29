import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
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
import { Text } from '~/components/ui/text';

export default function GLScreen() {
  const [currentShape, setCurrentShape] = useState<'box' | 'torus'>('torus');
  const [rotationSpeed, setRotationSpeed] = useState<'slow' | 'medium' | 'fast'>('fast');

  // 使用useRef存储场景相关对象，使其在渲染间保持持久
  const sceneRef = useRef<{
    scene?: Scene;
    mesh?: Mesh;
    renderer?: Renderer;
    camera?: PerspectiveCamera;
    animationFrameId?: number;
    gl?: ExpoWebGLRenderingContext;
    currentSpeed?: number;
  }>({});

  // 动画速度映射
  const speedMap = {
    slow: 0.01,
    medium: 0.03,
    fast: 0.05,
  };

  // 创建3D场景
  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    // 保存gl上下文引用
    sceneRef.current.gl = gl;

    // 创建three.js渲染器
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor('#000');
    sceneRef.current.renderer = renderer;

    // 创建场景
    const scene = new Scene();
    scene.fog = new Fog('#000', 1, 10000);
    sceneRef.current.scene = scene;

    // 创建透视相机
    const camera = new PerspectiveCamera(
      75, // 视野角度
      gl.drawingBufferWidth / gl.drawingBufferHeight, // 宽高比
      0.1, // 近截面
      1000 // 远截面
    );
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);
    sceneRef.current.camera = camera;

    // 添加光源 - 增加环境光强度，使场景更亮
    const ambientLight = new AmbientLight(0xffffff, 0.6); // 增加环境光强度
    scene.add(ambientLight);

    const spotLight = new SpotLight(0xffffff, 1.2); // 增加聚光灯强度
    spotLight.position.set(5, 5, 5);
    spotLight.lookAt(0, 0, 0);
    scene.add(spotLight);

    const pointLight = new PointLight(0xffffff, 1.2); // 增加点光源强度
    pointLight.position.set(-5, 3, 5);
    scene.add(pointLight);

    // 创建网格地面
    const gridHelper = new GridHelper(10, 10);
    scene.add(gridHelper);

    // 初始化几何体
    updateMesh();

    // 设置初始速度
    sceneRef.current.currentSpeed = speedMap[rotationSpeed];

    // 开始渲染循环
    startRenderLoop();
  };

  // 更新几何体函数
  const updateMesh = () => {
    const { scene } = sceneRef.current;
    if (!scene) return;

    // 如果已有网格，从场景中移除
    if (sceneRef.current.mesh) {
      scene.remove(sceneRef.current.mesh);
    }

    // 根据当前选择的形状创建新的几何体
    let mesh: Mesh;
    if (currentShape === 'box') {
      // 创建立方体
      const geometry = new BoxGeometry(1.5, 1.5, 1.5);
      const material = new MeshStandardMaterial({
        color: 0x60a5fa, // 更亮的蓝色
        emissive: 0x1e40af, // 添加发光效果
        emissiveIntensity: 0.2, // 发光强度
      });
      mesh = new Mesh(geometry, material);
    } else {
      // 创建圆环
      const geometry = new TorusGeometry(1, 0.4, 16, 100);
      const material = new MeshStandardMaterial({
        color: 0xf87171, // 更亮的红色
        emissive: 0xb91c1c, // 添加发光效果
        emissiveIntensity: 0.2, // 发光强度
      });
      mesh = new Mesh(geometry, material);
    }

    // 添加到场景并更新引用
    scene.add(mesh);
    sceneRef.current.mesh = mesh;
  };

  // 开始渲染循环
  const startRenderLoop = () => {
    if (sceneRef.current.animationFrameId) {
      cancelAnimationFrame(sceneRef.current.animationFrameId);
    }

    const render = () => {
      const { mesh, renderer, scene, camera, gl, currentSpeed } = sceneRef.current;
      if (!mesh || !renderer || !scene || !camera || !gl || currentSpeed === undefined) return;

      // 保存动画帧ID以便在需要时取消
      sceneRef.current.animationFrameId = requestAnimationFrame(render);

      // 旋转网格
      mesh.rotation.x += currentSpeed;
      mesh.rotation.y += currentSpeed;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    render();
  };

  // 当形状变化时更新网格
  useEffect(() => {
    if (sceneRef.current.scene) {
      updateMesh();
    }
  }, [currentShape]);

  // 当旋转速度变化时，更新速度值
  useEffect(() => {
    sceneRef.current.currentSpeed = speedMap[rotationSpeed];
  }, [rotationSpeed]);

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      const animationFrameId = sceneRef.current.animationFrameId;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <View className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">OpenGL 渲染</Text>
        <Text className="text-secondary-foreground">使用 OpenGL 进行高性能图形渲染。</Text>
      </View>

      <View className="h-80 w-full mb-4 overflow-hidden rounded-lg bg-gray-900">
        <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
      </View>

      <Text className="font-medium mb-2">选择形状：</Text>
      <View className="flex-row gap-3 mb-4">
        <Button variant={currentShape === 'torus' ? 'default' : 'outline'} onPress={() => setCurrentShape('torus')}>
          <Text>圆环</Text>
        </Button>
        <Button variant={currentShape === 'box' ? 'default' : 'outline'} onPress={() => setCurrentShape('box')}>
          <Text>立方体</Text>
        </Button>
      </View>

      <Text className="font-medium mb-2">旋转速度：</Text>
      <View className="flex-row gap-3">
        <Button variant={rotationSpeed === 'fast' ? 'default' : 'outline'} onPress={() => setRotationSpeed('fast')}>
          <Text>快速</Text>
        </Button>
        <Button variant={rotationSpeed === 'medium' ? 'default' : 'outline'} onPress={() => setRotationSpeed('medium')}>
          <Text>中速</Text>
        </Button>
        <Button variant={rotationSpeed === 'slow' ? 'default' : 'outline'} onPress={() => setRotationSpeed('slow')}>
          <Text>慢速</Text>
        </Button>
      </View>
    </View>
  );
}
