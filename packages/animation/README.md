# @tldraw/animation

基于 anime.js 的 tldraw 形状动画系统

## 🚀 功能特性

- ✨ **预定义动画**: 提供常用的动画预设（淡入淡出、滑动、缩放、旋转等）
- 🎭 **高级特效**: 爆炸、内爆、波纹、螺旋等复杂特效
- 🔄 **过渡动画**: 页面切换和形状转换动画
- 🎯 **精确控制**: 支持动画链、分组和时间轴
- ⚡ **高性能**: 基于 requestAnimationFrame 的优化动画循环
- 🪝 **React 集成**: 提供易用的 React hooks
- 📱 **事件系统**: 完整的动画生命周期事件

## 📦 安装

```bash
# 该包作为 tldraw monorepo 的一部分
yarn install
```

## 🎯 基本用法

### 使用 React Hooks

```tsx
import { useShapeAnimation } from '@tldraw/animation'

function MyComponent() {
  const { fadeIn, fadeOut, rotate, bounce } = useShapeAnimation()
  
  const handleFadeIn = () => {
    fadeIn(selectedShapeId, { duration: 1000 })
  }
  
  const handleRotate = () => {
    rotate(selectedShapeId, 360, { duration: 2000 })
  }
  
  return (
    <div>
      <button onClick={handleFadeIn}>淡入</button>
      <button onClick={handleRotate}>旋转</button>
    </div>
  )
}
```

### 直接使用动画系统

```tsx
import { AnimationSystem } from '@tldraw/animation'
import { useEditor } from '@tldraw/editor'

function MyComponent() {
  const editor = useEditor()
  const animationSystem = new AnimationSystem(editor)
  
  // 创建自定义动画
  animationSystem.animate({
    id: 'my-animation',
    type: 'custom',
    target: shapeId,
    properties: { x: 100, y: 200, rotation: Math.PI },
    duration: 1500,
    easing: 'easeOutBounce'
  })
}
```

## 🎨 预定义动画

### 基础动画
- `fadeIn()` / `fadeOut()` - 淡入淡出
- `slideIn()` - 滑动进入 (支持四个方向)
- `scaleIn()` - 缩放进入
- `rotate()` - 旋转
- `bounce()` - 弹跳
- `pulse()` - 脉冲
- `shake()` - 摇晃
- `moveTo()` - 移动到指定位置

### 高级特效
- `createExplode()` - 爆炸效果
- `createImplode()` - 内爆效果
- `createRipple()` - 波纹效果
- `createSpiral()` - 螺旋效果
- `createGlow()` - 发光效果
- `createTrail()` - 拖尾效果

### 过渡动画
- `createEnterTransition()` - 进入过渡
- `createExitTransition()` - 退出过渡
- `createWaveTransition()` - 波浪过渡
- `createCascadeTransition()` - 瀑布过渡

## 🎬 动画配置

```tsx
interface AnimationConfig {
  duration?: number        // 持续时间 (毫秒)
  delay?: number          // 延迟时间 (毫秒)
  easing?: string         // 缓动函数
  direction?: 'normal' | 'reverse' | 'alternate'
  loop?: boolean | number // 循环次数
  autoplay?: boolean      // 自动播放
}
```

## 🎭 动画事件

```tsx
import { useAnimationEvents } from '@tldraw/animation'

function MyComponent() {
  const { started, completed, clearEvents } = useAnimationEvents()
  
  useEffect(() => {
    console.log('已开始的动画:', started)
    console.log('已完成的动画:', completed)
  }, [started, completed])
}
```

## 🔄 动画控制

```tsx
const { animate, stop, stopAll, pause, resume } = useShapeAnimation()

// 开始动画
const animationId = animate(myAnimation)

// 停止特定动画
stop(animationId)

// 停止所有动画
stopAll()

// 暂停/恢复系统
pause()
resume()
```

## 📚 API 参考

### AnimationSystem 类

- `animate(animation: ShapeAnimation): string` - 开始动画
- `animateGroup(group: AnimationGroup): string` - 开始动画组
- `stop(animationId: string): boolean` - 停止动画
- `stopForShapes(shapeIds: TLShapeId[]): void` - 停止形状的所有动画
- `stopAll(): void` - 停止所有动画
- `pause() / resume(): void` - 暂停/恢复系统
- `getActiveAnimations(): ShapeAnimation[]` - 获取活动动画
- `isAnimating(shapeId?: TLShapeId): boolean` - 检查是否在动画中

### React Hooks

- `useAnimationSystem()` - 获取动画系统实例
- `useShapeAnimation()` - 完整的动画控制功能
- `useAnimationEvents()` - 动画事件监听
- `useShapeAnimationState(shapeIds)` - 检查特定形状的动画状态

## 🎯 示例

### 创建复杂动画序列

```tsx
function AnimationSequence() {
  const { fadeIn, slideIn, rotate, bounce } = useShapeAnimation()
  
  const playSequence = async () => {
    // 第一步：淡入
    await fadeIn(shapeId, { duration: 500 })
    
    // 第二步：滑入
    await slideIn(shapeId, 'left', 100, { duration: 800 })
    
    // 第三步：旋转
    await rotate(shapeId, 360, { duration: 1000 })
    
    // 第四步：弹跳
    await bounce(shapeId, 30, { duration: 600 })
  }
}
```

### 批量动画

```tsx
function BatchAnimation() {
  const { effects } = useShapeAnimation()
  
  const explodeShapes = () => {
    const shapeIds = ['shape1', 'shape2', 'shape3']
    effects.createExplode(shapeIds, 150, { duration: 1200 })
  }
  
  const rippleEffect = () => {
    const shapeIds = getAllShapeIds()
    effects.createRipple(400, 300, shapeIds, 100)
  }
}
```

## 🔧 开发

```bash
# 构建
yarn build

# 测试
yarn test

# 类型检查
yarn lint
```

## 📄 许可证

请参阅根目录的 LICENSE.md 文件。 