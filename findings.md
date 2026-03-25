# 研究发现

## 项目概况
- React Native (0.76.9) + Expo SDK 52 + pnpm
- 使用 expo-router、NativeWind、Tailwind CSS、i18n、Zustand、React Query
- 有完整的组件库（@rn-primitives）、地图、支付（Stripe）、扫码等

## 当前版本 vs 最新版本

| 依赖 | 当前版本 | 最新版本 | 差距 |
|------|---------|---------|------|
| react-native | 0.76.9 | 0.84.1 | 大版本跳跃 |
| expo | 52.0.44 | 55.0.8 | 跨 3 个小版本 |
| react | 18.3.1 | 19.2.4 | 跨大版本 |
| expo-router | 4.0.19 | 55.0.7 | 跨大版本 |
| typescript | 5.3.3 | 6.0.2 | 跨版本 |
| eslint | 8.57.0 | 10.1.0 | 跨版本 |
| @react-navigation/native | 7.0.14 | 7.2.0 | 小版本 |
| react-native-reanimated | 3.16.2 | 4.2.3 | 跨版本 |
| @gorhom/bottom-sheet | ~5 | 5.2.8 | 小版本 |
| react-native-screens | ~4.4.0 | 4.24.0 | 跨版本 |
| react-native-safe-area-context | 4.12.0 | 5.7.0 | 跨版本 |
| @tanstack/react-query | ~5.71.5 | 5.95.2 | 小版本 |
| zustand | ~4.4.7 | 5.0.12 | 跨版本 |
| nativewind | ~4.1.23 | 4.2.3 | 跨版本 |

## 当前 TypeScript 错误（Phase 1 优先修复）

### 1. 缺失 constants/Colors.ts（严重）
- `~/constants/Colors` 被多处引用但文件不存在
- 组件需要 `Colors.light.icon`、`Colors.dark.icon`、`Colors.light.text` 等

### 2. 缺失 @rn-primitives 包（可通过重新安装修复）
已声明在 package.json 但 node_modules 缺失：
- @rn-primitives/aspect-ratio
- @rn-primitives/collapsible
- @rn-primitives/context-menu
- @rn-primitives/dropdown-menu
- @rn-primitives/hover-card
- @rn-primitives/menubar
- @rn-primitives/navigation-menu
- @rn-primitives/popover
- @rn-primitives/table
- @rn-primitives/toggle-group
- @rn-primitives/toggle

### 3. expo-audio / expo-camera / expo-contacts / expo-location 类型声明缺失
- 这些包在 package.json 中，但类型声明找不到
- 可能需要重新安装 node_modules

### 4. system-permissions.tsx Button children prop 问题
- React Native Button 不再支持 children，需用 Pressable 替代

## React Native 0.77+ Breaking Changes（需注意）
- React 19 是必需的
- 部分旧 API 移除（View.propTypes 等 - 项目未使用）
- New Architecture 默认启用

## expo-router 4→55 重大变化
- 目录结构可能需要调整
- API routes 语法变化
- 需要详细查阅迁移文档

---

# Phase 3 发现问题记录

## 2026-03-25

### expo-doctor 检查结果

#### ✅ 已修复问题
- **配置插件格式问题**: `withAndroidQueries.js` 和 `metro.config.js` 的 CommonJS/ESM 冲突
  - 创建了 `.cjs` 版本并更新引用

#### ❌ 发现的问题

##### 1. Metro配置问题
- **状态**: 已修复
- **问题**: require is not defined in ES module scope
- **解决**: 重命名为 .cjs 格式

##### 2. 重复依赖问题（影响构建）
- `@expo/fingerprint`: 0.11.11 vs 0.16.6
- `@expo/vector-icons`: 14.0.4 vs 15.1.1
- `expo-manifests`: 0.15.8 vs 55.0.11
- `expo-task-manager`: 55.0.10 vs 12.0.6
- `unimodules-app-loader`: 55.0.2 vs 5.0.1
- `expo-updates-interface`: 1.0.0 vs 55.1.3
- `expo-json-utils`: 0.14.0 vs 55.0.0

##### 3. CocoaPods版本问题
- **问题**: CocoaPods may not be installed or there may be an issue with your CocoaPods installation
- **建议**: Installing version 1.15.2 or higher is recommended

##### 4. 原生项目配置不同步
- **问题**: 项目包含原生文件夹但配置属性在 app.config.ts，EAS Build 不会同步以下属性：
  - icon, scheme, orientation, userInterfaceStyle, android, ios, plugins, androidStatusBar

##### 5. 依赖版本不匹配（53个包）

**主要版本不匹配**:
- `@expo/metro-runtime`: expected ~55.0.6, found 4.0.1
- `@expo/vector-icons`: expected ^15.0.2, found 14.0.4
- `@sentry/react-native`: expected ~7.11.0, found 6.3.0
- `expo-background-task`: expected ~55.0.10, found 0.1.4
- 等多个expo-*包版本过低

**次要版本不匹配**:
- `react-native`: expected 0.83.2, found 0.84.1 (实际比期望的新)
- `@stripe/stripe-react-native`: expected 0.58.0, found 0.60.0 (实际比期望的新)
- 等其他包

### TypeScript 检查结果

#### ✅ 状态良好
- **TypeScript**: 0 错误
- 所有类型定义正确

### ESLint 检查结果

#### ⚠️ 32 个 warnings（0 errors）

**主要类别**:

1. **React Hooks依赖缺失** (15个)
   - `useEffect` 缺少依赖项
   - 主要集中在 discover/ 页面

2. **未使用变量** (12个)
   - 导入但未使用的变量
   - 定义但未使用的变量

3. **潜在内存泄漏** (1个)
   - `app/discover/gl.tsx`: ref 引用在cleanup函数中可能已变化

**详细列表**:
- `app/(tabs)/discover.tsx`: useEffect 缺少 discoverScrollY, updateDiscoverScroll
- `app/(tabs)/index.tsx`: setIsNoMore 未使用, useEffect 缺少 loadData
- `app/(tabs)/mine.tsx`: useEffect 缺少 mineScrollY, updateMineScroll
- `app/_layout.tsx`: onlineManager, Network, TypesafeI18n, isUpdatePending 未使用
- 其他20个discover页面的类似问题

### 影响评估

#### 🔴 高优先级（影响构建和功能）
1. **重复依赖** - 可能导致构建失败或运行时错误
2. **CocoaPods版本** - 影响iOS构建
3. **依赖版本不匹配** - 53个包版本问题

#### 🟡 中优先级（影响开发体验）
1. **原生配置不同步** - EAS Build相关
2. **部分useEffect依赖缺失** - 可能影响功能正确性

#### 🟢 低优先级（代码质量）
1. **未使用变量** - 代码清洁度问题
2. **大部分useEffect依赖缺失** - discover页面是demo性质

## 修复计划

### Phase 4 优先级
1. 清理重复依赖
2. 修复有实际影响的 useEffect 依赖问题
3. 移除未使用的导入和变量
4. 考虑CocoaPods升级（如需要iOS构建）
