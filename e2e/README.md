# Maestro E2E 测试

本目录包含 ChatQA React Native 应用的端到端（E2E）测试套件，使用 [Maestro](https://maestro.mobile.dev) 测试框架。

## 📋 目录结构

```
e2e/
├── .maestro/
│   └── config.yaml        # 全局 Maestro 配置
├── 01_launch.yaml         # 应用启动和基础UI验证
├── 02_navigation.yaml     # Tab 导航功能测试
├── 03_discover.yaml       # Discover 功能测试
├── 04_theme.yaml         # 主题和应用状态测试
└── README.md             # 本文件
```

## 🚀 安装 Maestro

### macOS/Linux (推荐)

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### 通过 Homebrew

```bash
brew tap mobile-dev-inc/tap
brew install maestro
```

### 验证安装

```bash
maestro --version
```

## ⚙️ 配置说明

### 全局配置 (`.maestro/config.yaml`)

- **appId**: 应用包名，根据环境切换
  - 开发环境: `com.jiezhiyong.qachat.dev`
  - 测试环境: `com.jiezhiyong.qachat.test`
  - 生产环境: `com.jiezhiyong.qachat`

### 环境切换

如需测试不同环境，修改 `.maestro/config.yaml` 中的 `appId` 字段：

```yaml
# 测试环境
appId: com.jiezhiyong.qachat.test

# 生产环境
appId: com.jiezhiyong.qachat
```

## 🧪 测试文件说明

### 01_launch.yaml - 应用启动测试

- **目标**: 验证应用正常启动和基础UI
- **测试内容**:
  - 应用启动流程
  - 底部 Tab 栏可见性验证
  - 默认 Home tab 状态
  - 基础滚动功能
  - 截图记录

### 02_navigation.yaml - 导航功能测试

- **目标**: 验证 Tab 之间的导航功能
- **测试内容**:
  - Home → Discover → Mine 导航
  - 各 Tab 页面加载验证
  - 快速切换 Tab 测试
  - 导航状态保持

### 03_discover.yaml - Discover 功能测试

- **目标**: 测试功能发现页面的交互
- **测试内容**:
  - Discover 页面加载
  - 搜索功能（搜索 "sentry"）
  - 列表滚动
  - 功能详情页进入和返回
  - 搜索清除功能

### 04_theme.yaml - 主题和应用状态测试

- **目标**: 测试应用状态变化和主题相关功能
- **测试内容**:
  - 应用前后台切换
  - App State 变化监听
  - 主题状态记录
  - 应用恢复功能

## 🏃‍♂️ 运行测试

### 前置条件

1. 确保已安装 Maestro
2. 应用已在设备/模拟器上安装并可启动
3. 设备/模拟器已连接并可通过 ADB/iOS 工具访问

### 运行所有测试

```bash
# 使用 npm 脚本
pnpm test:e2e

# 或直接使用 Maestro
maestro test e2e/
```

### 运行单个测试

```bash
# 使用 npm 脚本
pnpm test:e2e:single e2e/01_launch.yaml

# 或直接使用 Maestro
maestro test e2e/01_launch.yaml
```

### 运行特定测试组合

```bash
# 只运行基础测试
maestro test e2e/01_launch.yaml e2e/02_navigation.yaml

# 运行功能测试
maestro test e2e/03_discover.yaml e2e/04_theme.yaml
```

## 📱 设备要求

### Android

- Android 5.0+ (API level 21+)
- 已启用开发者选项和 USB 调试
- 通过 `adb devices` 可检测到设备

### iOS

- iOS 13.0+
- Xcode 和 iOS 模拟器已安装
- 设备通过 USB 连接或模拟器运行

## 🐛 故障排除

### 常见问题

1. **应用未启动**

   ```bash
   # 检查应用是否已安装
   # Android
   adb shell pm list packages | grep qachat

   # iOS
   xcrun simctl list apps
   ```

2. **Maestro 无法连接设备**

   ```bash
   # 检查设备连接
   maestro test --help

   # Android 设备检查
   adb devices

   # iOS 模拟器检查
   xcrun simctl list devices
   ```

3. **测试超时**

   - 检查应用启动时间
   - 确认网络连接正常
   - 适当增加测试中的超时设置

4. **UI 元素找不到**
   - 确认 UI 文本和 ID 匹配
   - 检查应用版本是否与测试匹配
   - 使用 Maestro Studio 检查元素选择器

### 调试技巧

1. **使用 Maestro Studio**

   ```bash
   maestro studio
   ```

2. **查看详细日志**

   ```bash
   maestro test --debug e2e/01_launch.yaml
   ```

3. **截图检查**
   - 测试会自动截图，检查 `@/.maestro/tests/` 目录

## 📊 测试报告

测试执行后，Maestro 会生成：

- 执行日志
- 截图文件
- 测试结果摘要

报告位置：`@/.maestro/tests/[timestamp]/`

## 🔄 CI/CD 集成

### GitHub Actions 示例

```yaml
# 待添加 GitHub Actions 配置
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run E2E tests
        run: |
          # 安装 Maestro
          curl -Ls "https://get.maestro.mobile.dev" | bash
          export PATH="$PATH":"$HOME/.maestro/bin"

          # 构建和测试应用
          # 待完善具体步骤
```

## 🤝 贡献指南

### 添加新测试

1. 在 `e2e/` 目录创建新的 `.yaml` 文件
2. 遵循现有测试的命名规范：`[序号]_[功能名].yaml`
3. 添加详细的注释和截图
4. 更新本 README

### 测试最佳实践

- 使用描述性的测试名称和注释
- 添加适当的等待和超时
- 包含关键步骤的截图
- 确保测试的幂等性（可重复执行）

## 📞 支持

如有问题或建议，请：

1. 查看 [Maestro 官方文档](https://maestro.mobile.dev)
2. 检查现有的 Issue 和 Pull Request
3. 创建新的 Issue 描述问题

---

_最后更新: 2026-03-25_
