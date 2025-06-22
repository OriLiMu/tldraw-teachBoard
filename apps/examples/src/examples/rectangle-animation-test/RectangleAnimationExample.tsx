import { useEffect, useState } from 'react'
import { Tldraw, useEditor, createShapeId, TLShapeId } from 'tldraw'
import 'tldraw/tldraw.css'

function AnimationControls() {
    const editor = useEditor()
    const [rectangleId, setRectangleId] = useState<TLShapeId | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)

    // 自动检测页面上的矩形
    useEffect(() => {
        console.log('🔍 Auto-detect effect running...', { editor: !!editor, rectangleId })

        if (!editor || rectangleId) return

        const shapes = editor.getCurrentPageShapes()
        console.log('📊 Found shapes for auto-detect:', shapes.length, shapes)

        const rectangle = shapes.find(shape =>
            shape.type === 'geo' &&
            'geo' in shape.props &&
            shape.props.geo === 'rectangle'
        )

        console.log('🔍 Found rectangle:', rectangle)

        if (rectangle) {
            console.log('✅ Setting rectangle ID:', rectangle.id)
            setRectangleId(rectangle.id)
        } else {
            console.log('❌ No rectangle found')
        }
    }, [editor, rectangleId])

    // 创建矩形
    const createRectangle = () => {
        console.log('🎨 Creating rectangle manually...', { editor: !!editor })

        if (!editor) {
            console.log('❌ No editor available for manual creation')
            return
        }

        // 创建一个红色矩形在左侧
        const shapeId = createShapeId()
        console.log('📦 Manual creation - Shape ID:', shapeId)

        const shape = editor.createShape({
            id: shapeId,
            type: 'geo',
            x: 100,
            y: 100,
            props: {
                w: 800,
                h: 600,
                geo: 'rectangle',
                color: 'blue',
                fill: 'solid',
            },
        })

        console.log('✅ Manual shape created:', shape)

        // 验证形状是否被创建
        const createdShape = editor.getShape(shapeId)
        console.log('🔍 Manual verification - Retrieved shape:', createdShape)
        console.log('🔍 Shape props:', createdShape?.props)
        console.log('🔍 Shape size should be: 800x600')

        // 调整视图以确保矩形可见
        editor.zoomToFit()
        setTimeout(() => {
            editor.zoomOut()
        }, 100)

        setRectangleId(shapeId)
        console.log('📌 Set rectangle ID to:', shapeId)

        return shapeId
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
            <h3>Rectangle Animation Test</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                    fontSize: '14px',
                    color: rectangleId ? '#0a5' : '#f00',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    padding: '5px',
                    backgroundColor: rectangleId ? '#e8f5e8' : '#ffe8e8',
                    borderRadius: '3px'
                }}>
                    Rectangle: {rectangleId ? 'Ready ✓ (Look for blue rectangle on canvas!)' : 'None found - Click "Create New Rectangle"'}
                </div>
                <button
                    onClick={createRectangle}
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                >
                    Create New Rectangle
                </button>
                <button
                    onClick={() => {
                        if (!editor) return
                        const newShapeId = createShapeId()
                        editor.createShape({
                            id: newShapeId,
                            type: 'geo',
                            x: 300,
                            y: 300,
                            props: {
                                w: 600,
                                h: 400,
                                geo: 'rectangle',
                                color: 'green',
                                fill: 'solid',
                            },
                        })
                        console.log('🟢 Created second rectangle:', newShapeId)
                        editor.zoomToFit()
                    }}
                    style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#e8f5e8' }}
                >
                    Create Another Rectangle (Green)
                </button>
                <button
                    onClick={() => {
                        if (!editor) return
                        const newShapeId = createShapeId()
                        editor.createShape({
                            id: newShapeId,
                            type: 'geo',
                            x: 500,
                            y: 150,
                            props: {
                                w: 400,
                                h: 300,
                                geo: 'rectangle',
                                color: 'red',
                                fill: 'semi',
                            },
                        })
                        console.log('🔴 Created third rectangle:', newShapeId)
                        editor.zoomToFit()
                    }}
                    style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#ffe8e8' }}
                >
                    Create Third Rectangle (Red)
                </button>
                <button
                    onClick={animateLeftToRight}
                    disabled={!rectangleId || isAnimating}
                    style={{
                        padding: '8px 16px',
                        cursor: (!rectangleId || isAnimating) ? 'not-allowed' : 'pointer',
                        opacity: (!rectangleId || isAnimating) ? 0.5 : 1
                    }}
                >
                    Move Left to Right
                </button>
                <button
                    onClick={animateBackAndForth}
                    disabled={!rectangleId || isAnimating}
                    style={{
                        padding: '8px 16px',
                        cursor: (!rectangleId || isAnimating) ? 'not-allowed' : 'pointer',
                        opacity: (!rectangleId || isAnimating) ? 0.5 : 1
                    }}
                >
                    Move Back and Forth
                </button>
                <button
                    onClick={animateCircularPath}
                    disabled={!rectangleId || isAnimating}
                    style={{
                        padding: '8px 16px',
                        cursor: (!rectangleId || isAnimating) ? 'not-allowed' : 'pointer',
                        opacity: (!rectangleId || isAnimating) ? 0.5 : 1
                    }}
                >
                    Circular Path
                </button>
                <button
                    onClick={resetPosition}
                    disabled={!rectangleId}
                    style={{
                        padding: '8px 16px',
                        cursor: !rectangleId ? 'not-allowed' : 'pointer',
                        opacity: !rectangleId ? 0.5 : 1
                    }}
                >
                    Reset Position
                </button>
                <div style={{ fontSize: '12px', color: '#666' }}>
                    Status: {isAnimating ? 'Animating...' : 'Idle'}
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