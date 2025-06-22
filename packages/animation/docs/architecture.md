# @tldraw/animation 架构文档

## 📁 项目结构

```
packages/animation/
├── package.json                    # 包配置和依赖
├── tsconfig.json                   # TypeScript 配置
├── README.md                       # 用户文档
├── src/
│   ├── index.ts                    # 主入口文件
│   └── lib/
│       ├── types.ts                # 类型定义
│       ├── utils.ts                # 工具函数
│       ├── animations.ts           # 预定义动画
│       ├── effects.ts              # 特效动画
│       ├── transitions.ts          # 过渡动画
│       ├── AnimationSystem.ts      # 核心动画系统
│       └── hooks.ts                # React Hooks
├── examples/
│   └── basic-usage.template.tsx    # 使用示例模板
└── docs/
    └── architecture.md             # 架构文档
```

## 🏗️ 核心架构

### 1. 类型系统 (`types.ts`)

- **AnimationConfig**: 动画配置接口
- **ShapeAnimationProps**: 形状动画属性
- **ShapeAnimation**: 完整的动画定义
- **AnimationGroup**: 动画组管理
- **AnimationType**: 动画类型枚举

### 2. 工具函数 (`utils.ts`)

- `generateAnimationId()`: 生成唯一动画ID
- `validateAnimationProps()`: 验证动画属性
- `interpolate()`: 数值插值计算
- `easingFunctions`: 缓动函数集合
- `normalizeShapeIds()`: 标准化形状ID数组

### 3. 预定义动画 (`animations.ts`)

基础动画预设：
- `fadeIn()` / `fadeOut()`: 淡入淡出
- `slideIn()`: 滑动动画
- `scaleIn()`: 缩放动画
- `rotate()`: 旋转动画
- `bounce()`: 弹跳动画
- `pulse()`: 脉冲动画
- `shake()`: 摇晃动画
- `moveTo()`: 移动动画

### 4. 特效系统 (`effects.ts`)

高级特效：
- `createExplode()`: 爆炸效果
- `createImplode()`: 内爆效果
- `createRipple()`: 波纹效果
- `createSpiral()`: 螺旋效果
- `createGlow()`: 发光效果
- `createTrail()`: 拖尾效果
- `createMorph()`: 变形效果

### 5. 过渡动画 (`transitions.ts`)

页面和状态过渡：
- `createEnterTransition()`: 进入过渡
- `createExitTransition()`: 退出过渡
- `createSequentialTransition()`: 序列过渡
- `createWaveTransition()`: 波浪过渡
- `createCascadeTransition()`: 瀑布过渡
- `createRandomTransition()`: 随机过渡

### 6. 动画系统核心 (`AnimationSystem.ts`)

核心管理类：
- **状态管理**: 活动动画、动画组管理
- **事件系统**: 动画生命周期事件
- **性能优化**: requestAnimationFrame 循环
- **形状更新**: 与 tldraw Editor 集成

主要方法：
- `animate()`: 开始单个动画
- `animateGroup()`: 开始动画组
- `stop()` / `stopAll()`: 停止动画
- `pause()` / `resume()`: 暂停/恢复系统

### 7. React 集成 (`hooks.ts`)

React Hooks：
- `useAnimationSystem()`: 动画系统实例
- `useShapeAnimation()`: 完整动画控制
- `useAnimationEvents()`: 事件监听
- `useShapeAnimationState()`: 形状动画状态

## 🔄 数据流

```
React Component
    ↓ (使用 hooks)
useShapeAnimation
    ↓ (调用方法)
AnimationSystem
    ↓ (管理状态)
Active Animations Map
    ↓ (更新循环)
requestAnimationFrame
    ↓ (属性插值)
Shape Properties
    ↓ (更新形状)
tldraw Editor
```

## 🎯 设计原则

### 1. 模块化设计
- 每个模块专注单一职责
- 清晰的接口和依赖关系
- 易于扩展和维护

### 2. 类型安全
- 完整的 TypeScript 类型定义
- 编译时类型检查
- 优秀的开发体验

### 3. 性能优化
- 基于 requestAnimationFrame 的高效动画循环
- 智能的状态管理和更新
- 最小化不必要的计算

### 4. 易用性
- 直观的 API 设计
- 丰富的预设动画
- 完整的 React 集成

### 5. 可扩展性
- 插件式的动画类型
- 灵活的配置系统
- 支持自定义动画

## 🔌 集成方式

### 与 tldraw Editor 集成
- 通过 `useEditor()` 获取编辑器实例
- 使用 `editor.updateShape()` 更新形状属性
- 监听形状选择和状态变化

### 与 anime.js 集成
- 使用 anime.js 的缓动函数
- 可选集成 anime.js 的高级功能
- 保持轻量级的核心实现

## 🚀 使用场景

1. **教育演示**: 形状动画解释概念
2. **用户引导**: 过渡动画引导用户操作
3. **视觉反馈**: 交互动画提供操作反馈
4. **演示制作**: 专业的演示动画效果
5. **游戏化**: 增加趣味性和互动性

## 🔮 未来扩展

1. **Timeline 编辑器**: 可视化的动画时间轴
2. **关键帧动画**: 支持复杂的关键帧动画
3. **物理引擎**: 集成物理模拟效果
4. **3D 动画**: 支持 3D 变换和动画
5. **导出功能**: 导出为视频或 GIF

## 📊 技术栈

- **TypeScript**: 类型安全的 JavaScript
- **React**: 用户界面库
- **anime.js**: 轻量级动画库
- **tldraw**: 白板编辑器框架
- **requestAnimationFrame**: 浏览器动画 API 