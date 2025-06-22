import React from 'react'
import { useEditor } from '@tldraw/editor'
// Note: In actual usage, these would be imported from '@tldraw/animation'
// import { useShapeAnimation, useAnimationEvents } from '@tldraw/animation'

// 基本动画示例组件
export function BasicAnimationExample() {
    const editor = useEditor()
    const {
        fadeIn,
        fadeOut,
        slideIn,
        rotate,
        bounce,
        pulse,
        shake,
        moveTo,
        stopAll,
        pause,
        resume,
        isAnimating,
        animationCount,
    } = useShapeAnimation()

    const { started, completed, clearEvents } = useAnimationEvents()

    // 获取当前选中的形状
    const selectedShapes = editor.getSelectedShapes()
    const selectedShapeIds = selectedShapes.map(shape => shape.id)

    if (selectedShapeIds.length === 0) {
        return (
            <div className="animation-panel">
                <p>请先选择一个或多个形状来开始动画</p>
            </div>
        )
    }

    return (
        <div className="animation-panel">
            <h3>🎬 动画控制面板</h3>

            {/* 动画状态 */}
            <div className="animation-status">
                <p>活动动画数量: {animationCount}</p>
                <p>系统状态: {isAnimating ? '🎬 动画中' : '⏸️ 空闲'}</p>
            </div>

            {/* 基础动画 */}
            <div className="animation-group">
                <h4>基础动画</h4>
                <div className="button-grid">
                    <button
                        onClick={() => fadeIn(selectedShapeIds, { duration: 1000 })}
                        disabled={isAnimating}
                    >
                        淡入
                    </button>
                    <button
                        onClick={() => fadeOut(selectedShapeIds, { duration: 1000 })}
                        disabled={isAnimating}
                    >
                        淡出
                    </button>
                    <button
                        onClick={() => slideIn(selectedShapeIds, 'left', 100, { duration: 800 })}
                        disabled={isAnimating}
                    >
                        滑入
                    </button>
                    <button
                        onClick={() => rotate(selectedShapeIds, 360, { duration: 1500 })}
                        disabled={isAnimating}
                    >
                        旋转
                    </button>
                </div>
            </div>

            {/* 特效动画 */}
            <div className="animation-group">
                <h4>特效动画</h4>
                <div className="button-grid">
                    <button
                        onClick={() => bounce(selectedShapeIds, 30, { duration: 800 })}
                        disabled={isAnimating}
                    >
                        弹跳
                    </button>
                    <button
                        onClick={() => pulse(selectedShapeIds, 1.2, { duration: 600 })}
                        disabled={isAnimating}
                    >
                        脉冲
                    </button>
                    <button
                        onClick={() => shake(selectedShapeIds, 15, { duration: 500 })}
                        disabled={isAnimating}
                    >
                        摇晃
                    </button>
                    <button
                        onClick={() => moveTo(selectedShapeIds, 400, 300, { duration: 1200 })}
                        disabled={isAnimating}
                    >
                        移动到中心
                    </button>
                </div>
            </div>

            {/* 系统控制 */}
            <div className="animation-group">
                <h4>系统控制</h4>
                <div className="button-grid">
                    <button onClick={pause} disabled={!isAnimating}>
                        ⏸️ 暂停
                    </button>
                    <button onClick={resume} disabled={!isAnimating}>
                        ▶️ 恢复
                    </button>
                    <button onClick={stopAll} disabled={!isAnimating}>
                        ⏹️ 停止所有
                    </button>
                    <button onClick={clearEvents}>
                        🗑️ 清除事件
                    </button>
                </div>
            </div>

            {/* 事件日志 */}
            <div className="animation-group">
                <h4>事件日志</h4>
                <div className="event-log">
                    <div>
                        <strong>已开始:</strong> {started.length} 个动画
                    </div>
                    <div>
                        <strong>已完成:</strong> {completed.length} 个动画
                    </div>
                    {started.length > 0 && (
                        <details>
                            <summary>最近开始的动画</summary>
                            <pre>{JSON.stringify(started.slice(-3), null, 2)}</pre>
                        </details>
                    )}
                </div>
            </div>

            <style>{`
				.animation-panel {
					padding: 16px;
					border: 1px solid #ddd;
					border-radius: 8px;
					font-family: Arial, sans-serif;
				}
				
				.animation-status {
					background: #f5f5f5;
					padding: 8px;
					border-radius: 4px;
					margin-bottom: 16px;
				}
				
				.animation-group {
					margin-bottom: 16px;
				}
				
				.animation-group h4 {
					margin-bottom: 8px;
					color: #333;
				}
				
				.button-grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
					gap: 8px;
				}
				
				.button-grid button {
					padding: 8px 12px;
					border: 1px solid #ccc;
					border-radius: 4px;
					background: white;
					cursor: pointer;
					transition: background-color 0.2s;
				}
				
				.button-grid button:hover:not(:disabled) {
					background: #f0f0f0;
				}
				
				.button-grid button:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
				
				.event-log {
					background: #f9f9f9;
					padding: 8px;
					border-radius: 4px;
					font-size: 14px;
				}
				
				.event-log pre {
					background: #eee;
					padding: 8px;
					border-radius: 4px;
					overflow: auto;
					max-height: 200px;
				}
			`}</style>
        </div>
    )
} 