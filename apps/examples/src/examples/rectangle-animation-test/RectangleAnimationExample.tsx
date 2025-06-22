import { useEffect, useState } from 'react'
import { Tldraw, useEditor, createShapeId, TLShapeId } from 'tldraw'
import 'tldraw/tldraw.css'

// 矩形配置接口
interface RectangleConfig {
    x?: number
    y?: number
    width?: number
    height?: number
    color?: string
    fill?: 'none' | 'semi' | 'solid' | 'pattern'
    label?: string
}

function AnimationControls() {
    const editor = useEditor()
    const [rectangleId, setRectangleId] = useState<TLShapeId | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)

    // 自动创建测试矩形
    useEffect(() => {
        console.log('🔍 Auto-create effect running...', { editor: !!editor, rectangleId })

        if (!editor || rectangleId) return

        // 检查是否已有矩形
        const shapes = editor.getCurrentPageShapes()
        const existingRectangle = shapes.find(shape =>
            shape.type === 'geo' &&
            'geo' in shape.props &&
            shape.props.geo === 'rectangle'
        )

        if (existingRectangle) {
            console.log('✅ Found existing rectangle:', existingRectangle.id)
            setRectangleId(existingRectangle.id)
        } else {
            // 自动创建默认测试矩形
            const defaultConfig: RectangleConfig = {
                x: 100,
                y: 100,
                width: 600,
                height: 400,
                color: 'blue',
                fill: 'solid',
                label: 'Test Rectangle'
            }

            const newRectangleId = createTestRectangle(defaultConfig)
            if (newRectangleId) {
                setRectangleId(newRectangleId)
                console.log('🎨 Auto-created test rectangle:', newRectangleId)
            }
        }
    }, [editor])

    // 创建测试矩形的通用函数
    const createTestRectangle = (config: RectangleConfig): TLShapeId | null => {
        console.log('🎨 Creating test rectangle...', config)

        if (!editor) {
            console.log('❌ No editor available')
            return null
        }

        const {
            x = 100,
            y = 100,
            width = 600,
            height = 400,
            color = 'blue',
            fill = 'solid',
            label = 'Rectangle'
        } = config

        const shapeId = createShapeId()
        console.log('📦 Creating shape with ID:', shapeId)

        try {
            editor.createShape({
                id: shapeId,
                type: 'geo',
                x,
                y,
                props: {
                    w: width,
                    h: height,
                    geo: 'rectangle',
                    color,
                    fill,
                },
            })

            // 验证创建
            const createdShape = editor.getShape(shapeId)
            if (createdShape) {
                console.log('✅ Rectangle created successfully:', {
                    id: shapeId,
                    size: `${width}x${height}`,
                    position: `(${x}, ${y})`,
                    color,
                    fill
                })

                // 调整视图
                editor.zoomToFit()
                setTimeout(() => editor.zoomOut(), 100)

                return shapeId
            } else {
                console.log('❌ Failed to create rectangle')
                return null
            }
        } catch (error) {
            console.error('❌ Error creating rectangle:', error)
            return null
        }
    }

    // 手动创建新矩形
    const createNewRectangle = () => {
        const config: RectangleConfig = {
            x: 100,
            y: 100,
            width: 800,
            height: 600,
            color: 'blue',
            fill: 'solid',
            label: 'Main Test Rectangle'
        }

        const newId = createTestRectangle(config)
        if (newId) {
            setRectangleId(newId)
        }
    }

    // 创建不同样式的矩形
    const createVariantRectangle = (variant: 'small' | 'medium' | 'large') => {
        const configs = {
            small: {
                x: 200,
                y: 200,
                width: 300,
                height: 200,
                color: 'red',
                fill: 'semi' as const,
                label: 'Small Rectangle'
            },
            medium: {
                x: 300,
                y: 300,
                width: 500,
                height: 350,
                color: 'green',
                fill: 'solid' as const,
                label: 'Medium Rectangle'
            },
            large: {
                x: 50,
                y: 50,
                width: 900,
                height: 700,
                color: 'orange',
                fill: 'pattern' as const,
                label: 'Large Rectangle'
            }
        }

        const config = configs[variant]
        const newId = createTestRectangle(config)

        // 如果这是第一个矩形，设置为主要矩形
        if (newId && !rectangleId) {
            setRectangleId(newId)
        }
    }

    // 简单的动画函数 - 使用 requestAnimationFrame
    const animateToPosition = (targetX: number, targetY: number, duration: number = 2000) => {
        console.log('🎯 animateToPosition called', { targetX, targetY, duration, editor: !!editor, rectangleId })

        if (!editor || !rectangleId) {
            console.log('❌ Cannot animate: missing editor or rectangleId', { editor: !!editor, rectangleId })
            return
        }

        const shape = editor.getShape(rectangleId)
        console.log('📦 Current shape:', shape)

        if (!shape) {
            console.log('❌ Shape not found with ID:', rectangleId)
            return
        }

        const startX = shape.x
        const startY = shape.y
        const startTime = Date.now()

        console.log('🚀 Starting animation from', { startX, startY }, 'to', { targetX, targetY })

        setIsAnimating(true)

        const animate = () => {
            const currentTime = Date.now()
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            // 缓动函数 (ease-out)
            const easedProgress = 1 - Math.pow(1 - progress, 3)

            const currentX = startX + (targetX - startX) * easedProgress
            const currentY = startY + (targetY - startY) * easedProgress

            editor.updateShape({
                id: rectangleId,
                type: 'geo',
                x: currentX,
                y: currentY,
            })

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                setIsAnimating(false)
            }
        }

        requestAnimationFrame(animate)
    }

    // 动画：从左到右移动
    const animateLeftToRight = () => {
        console.log('🎬 Starting left to right animation...', { rectangleId, isAnimating })
        animateToPosition(1000, 100, 2000)
    }

    // 重置位置
    const resetPosition = () => {
        if (!editor || !rectangleId) return

        setIsAnimating(false)
        editor.updateShape({
            id: rectangleId,
            type: 'geo',
            x: 100,
            y: 100
        })
    }

    // 连续动画：来回移动
    const animateBackAndForth = () => {
        if (!editor || !rectangleId || isAnimating) return

        // 先移动到右边
        animateToPosition(1000, 100, 1500)

        // 使用延时来实现序列动画
        setTimeout(() => {
            if (rectangleId && !isAnimating) {
                animateToPosition(100, 100, 1500)
            }
        }, 1600) // 稍微延长一点时间确保第一个动画完成
    }

    // 圆形路径动画
    const animateCircularPath = () => {
        if (!editor || !rectangleId || isAnimating) return

        const centerX = 500
        const centerY = 400
        const radius = 250

        // 移动到圆形路径上的几个点
        const points = [
            { x: centerX + radius, y: centerY }, // 右
            { x: centerX, y: centerY - radius }, // 上
            { x: centerX - radius, y: centerY }, // 左
            { x: centerX, y: centerY + radius }, // 下
            { x: centerX + radius, y: centerY }, // 回到起点
        ]

        let currentIndex = 0

        const animateToNextPoint = () => {
            if (currentIndex >= points.length) {
                setIsAnimating(false)
                return
            }

            const point = points[currentIndex]
            animateToPosition(point.x, point.y, 800)

            currentIndex++
            setTimeout(animateToNextPoint, 900)
        }

        setIsAnimating(true)
        animateToNextPoint()
    }

    // 清除所有矩形
    const clearAllRectangles = () => {
        if (!editor) return

        const shapes = editor.getCurrentPageShapes()
        const rectangles = shapes.filter(shape =>
            shape.type === 'geo' &&
            'geo' in shape.props &&
            shape.props.geo === 'rectangle'
        )

        if (rectangles.length > 0) {
            editor.deleteShapes(rectangles.map(r => r.id))
            setRectangleId(null)
            setIsAnimating(false)
            console.log(`🗑️ Cleared ${rectangles.length} rectangles`)
        }
    }

    // 获取当前矩形数量
    const getRectangleCount = () => {
        if (!editor) return 0
        const shapes = editor.getCurrentPageShapes()
        return shapes.filter(shape =>
            shape.type === 'geo' &&
            'geo' in shape.props &&
            shape.props.geo === 'rectangle'
        ).length
    }

    return (
        <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1000,
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <h3>🎯 Rectangle Animation Test</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                    fontSize: '14px',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    padding: '8px',
                    backgroundColor: '#f0f8ff',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                }}>
                    📊 状态信息:
                    <div style={{ fontSize: '12px', marginTop: '4px', fontWeight: 'normal' }}>
                        • 画布上的矩形: {getRectangleCount()} 个
                        <br />
                        • 主要矩形: {rectangleId ? `✅ 已选择 (ID: ${rectangleId.slice(0, 8)}...)` : '❌ 未选择'}
                        <br />
                        • 动画状态: {isAnimating ? '🎬 运行中' : '⏸️ 空闲'}
                    </div>
                </div>

                <div style={{
                    padding: '8px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '5px',
                    border: '1px solid #eee'
                }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                        🎨 创建矩形:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                        <button
                            onClick={createNewRectangle}
                            style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#e8f0ff', fontSize: '12px' }}
                        >
                            🔵 主要矩形
                        </button>
                        <button
                            onClick={() => createVariantRectangle('small')}
                            style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#ffe8e8', fontSize: '12px' }}
                        >
                            🔴 小矩形
                        </button>
                        <button
                            onClick={() => createVariantRectangle('medium')}
                            style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#e8f5e8', fontSize: '12px' }}
                        >
                            🟢 中矩形
                        </button>
                        <button
                            onClick={() => createVariantRectangle('large')}
                            style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#fff3e0', fontSize: '12px' }}
                        >
                            🟠 大矩形
                        </button>
                    </div>
                    <button
                        onClick={clearAllRectangles}
                        style={{
                            padding: '6px 12px',
                            cursor: 'pointer',
                            backgroundColor: '#ffebee',
                            color: '#d32f2f',
                            marginTop: '8px',
                            width: '100%',
                            fontSize: '12px'
                        }}
                    >
                        🗑️ 清除所有矩形
                    </button>
                </div>

                <div style={{
                    padding: '8px',
                    backgroundColor: '#f0f8ff',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                        🎬 动画控制:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                        <button
                            onClick={animateLeftToRight}
                            disabled={!rectangleId || isAnimating}
                            style={{
                                padding: '6px 12px',
                                cursor: (!rectangleId || isAnimating) ? 'not-allowed' : 'pointer',
                                opacity: (!rectangleId || isAnimating) ? 0.5 : 1,
                                fontSize: '12px',
                                backgroundColor: '#e3f2fd'
                            }}
                        >
                            ➡️ 左到右
                        </button>
                        <button
                            onClick={animateBackAndForth}
                            disabled={!rectangleId || isAnimating}
                            style={{
                                padding: '6px 12px',
                                cursor: (!rectangleId || isAnimating) ? 'not-allowed' : 'pointer',
                                opacity: (!rectangleId || isAnimating) ? 0.5 : 1,
                                fontSize: '12px',
                                backgroundColor: '#f3e5f5'
                            }}
                        >
                            ↔️ 来回移动
                        </button>
                        <button
                            onClick={animateCircularPath}
                            disabled={!rectangleId || isAnimating}
                            style={{
                                padding: '6px 12px',
                                cursor: (!rectangleId || isAnimating) ? 'not-allowed' : 'pointer',
                                opacity: (!rectangleId || isAnimating) ? 0.5 : 1,
                                fontSize: '12px',
                                backgroundColor: '#e8f5e8'
                            }}
                        >
                            🔄 圆形路径
                        </button>
                        <button
                            onClick={resetPosition}
                            disabled={!rectangleId}
                            style={{
                                padding: '6px 12px',
                                cursor: !rectangleId ? 'not-allowed' : 'pointer',
                                opacity: !rectangleId ? 0.5 : 1,
                                fontSize: '12px',
                                backgroundColor: '#fff3e0'
                            }}
                        >
                            🏠 重置位置
                        </button>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                        状态: {isAnimating ? '🎬 动画中...' : '⏸️ 空闲'}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function RectangleAnimationExample() {
    return (
        <div className="tldraw__editor" style={{ position: 'relative' }}>
            <Tldraw>
                <AnimationControls />
            </Tldraw>
        </div>
    )
} 