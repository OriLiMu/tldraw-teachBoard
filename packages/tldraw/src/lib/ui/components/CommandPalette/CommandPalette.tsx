import React, { useState, useEffect, useRef } from 'react'
import { useEditor } from '@tldraw/editor'
import { Dialog as _Dialog } from 'radix-ui'
import { GeoShapeGeoStyle } from '@tldraw/editor'

// 命令类型定义
interface Command {
    id: string
    label: string
    labelEn: string // 添加英文标签用于搜索
    description: string
    descriptionEn: string // 添加英文描述用于搜索
    category: string
    shortcut?: string
    icon?: string
    action: () => void
}

// 命令面板组件
export function CommandPalette() {
    const editor = useEditor()
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)

    // 定义所有形状和常用命令
    const commands: Command[] = [
        {
            id: 'create-rectangle',
            label: '创建矩形',
            labelEn: 'Create Rectangle',
            description: '在画板上创建一个新的矩形形状',
            descriptionEn: 'Create a new rectangle shape on the canvas',
            category: '形状',
            shortcut: 'R',
            icon: '▢',
            action: () => {
                editor.setCurrentTool('geo')
                editor.setStyleForNextShapes(GeoShapeGeoStyle, 'rectangle')
                setIsOpen(false)
            }
        },
        {
            id: 'create-ellipse',
            label: '创建椭圆',
            labelEn: 'Create Ellipse',
            description: '在画板上创建一个新的椭圆形状',
            descriptionEn: 'Create a new ellipse shape on the canvas',
            category: '形状',
            shortcut: 'O',
            icon: '○',
            action: () => {
                editor.setCurrentTool('geo')
                editor.setStyleForNextShapes(GeoShapeGeoStyle, 'ellipse')
                setIsOpen(false)
            }
        },
        {
            id: 'create-triangle',
            label: '创建三角形',
            labelEn: 'Create Triangle',
            description: '在画板上创建一个新的三角形形状',
            descriptionEn: 'Create a new triangle shape on the canvas',
            category: '形状',
            shortcut: 'T',
            icon: '△',
            action: () => {
                editor.setCurrentTool('geo')
                editor.setStyleForNextShapes(GeoShapeGeoStyle, 'triangle')
                setIsOpen(false)
            }
        },
        {
            id: 'create-diamond',
            label: '创建菱形',
            labelEn: 'Create Diamond',
            description: '在画板上创建一个新的菱形形状',
            descriptionEn: 'Create a new diamond shape on the canvas',
            category: '形状',
            shortcut: 'D',
            icon: '◆',
            action: () => {
                editor.setCurrentTool('geo')
                editor.setStyleForNextShapes(GeoShapeGeoStyle, 'diamond')
                setIsOpen(false)
            }
        },
        {
            id: 'create-arrow',
            label: '创建箭头',
            labelEn: 'Create Arrow',
            description: '在画板上创建一个新的箭头',
            descriptionEn: 'Create a new arrow on the canvas',
            category: '形状',
            shortcut: 'A',
            icon: '→',
            action: () => {
                editor.setCurrentTool('arrow')
                setIsOpen(false)
            }
        },
        {
            id: 'create-line',
            label: '创建直线',
            labelEn: 'Create Line',
            description: '在画板上创建一个新的直线',
            descriptionEn: 'Create a new line on the canvas',
            category: '形状',
            shortcut: 'L',
            icon: '—',
            action: () => {
                editor.setCurrentTool('line')
                setIsOpen(false)
            }
        },
        {
            id: 'create-draw',
            label: '自由绘制',
            labelEn: 'Free Draw',
            description: '使用画笔自由绘制',
            descriptionEn: 'Draw freely with the pen tool',
            category: '绘制',
            shortcut: 'P',
            icon: '✏',
            action: () => {
                editor.setCurrentTool('draw')
                setIsOpen(false)
            }
        },
        {
            id: 'create-text',
            label: '创建文本',
            labelEn: 'Create Text',
            description: '在画板上添加文本',
            descriptionEn: 'Add text to the canvas',
            category: '文本',
            shortcut: 'X',
            icon: 'T',
            action: () => {
                editor.setCurrentTool('text')
                setIsOpen(false)
            }
        },
        {
            id: 'clear-canvas',
            label: '清空画板',
            labelEn: 'Clear Canvas',
            description: '删除画板上的所有形状和内容',
            descriptionEn: 'Delete all shapes and content from the canvas',
            category: '编辑',
            shortcut: 'Ctrl+A',
            icon: '✕',
            action: () => {
                const allShapeIds = Array.from(editor.getCurrentPageShapeIds())
                if (allShapeIds.length > 0) {
                    editor.deleteShapes(allShapeIds)
                }
                setIsOpen(false)
            }
        },
        {
            id: 'zoom-fit',
            label: '适应窗口',
            labelEn: 'Zoom to Fit',
            description: '缩放画板以适应所有内容到视图中',
            descriptionEn: 'Zoom the canvas to fit all content in the view',
            category: '视图',
            shortcut: 'Shift+1',
            icon: '⌕',
            action: () => {
                editor.zoomToFit()
                setIsOpen(false)
            }
        }
    ]

    // 过滤命令 - 支持中英文搜索
    const filteredCommands = commands.filter(command => {
        const query = searchQuery.toLowerCase()
        return (
            // 中文搜索
            command.label.toLowerCase().includes(query) ||
            command.description.toLowerCase().includes(query) ||
            command.category.toLowerCase().includes(query) ||
            // 英文搜索
            command.labelEn.toLowerCase().includes(query) ||
            command.descriptionEn.toLowerCase().includes(query)
        )
    })

    // 键盘事件处理
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+K 或 Cmd+K 打开命令面板
            if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                setIsOpen(true)
                setSearchQuery('')
                setSelectedIndex(0)
            }

            // ESC 关闭命令面板
            if (e.key === 'Escape') {
                setIsOpen(false)
            }

            // 当命令面板打开时的键盘导航
            if (isOpen) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setSelectedIndex(prev => Math.max(prev - 1, 0))
                } else if (e.key === 'Tab') {
                    e.preventDefault()
                    setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
                } else if (e.key === 'Enter') {
                    e.preventDefault()
                    if (filteredCommands[selectedIndex]) {
                        filteredCommands[selectedIndex].action()
                    }
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, filteredCommands, selectedIndex])

    // 自动聚焦输入框
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    // 重置选中索引当搜索改变时
    useEffect(() => {
        setSelectedIndex(0)
    }, [searchQuery])

    if (!isOpen) return null

    return (
        <>
            {/* 命令面板 */}
            <div
                className="tlui-command-palette"
                style={{
                    position: 'fixed',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '420px', // 70% of 600px
                    maxWidth: '70vw', // 70% of viewport width
                    borderRadius: '6px',
                    boxShadow: '0px 4px 6px 2px rgba(0, 0, 0, 0.1)',
                    zIndex: 'var(--layer-overlays)',
                    animation: 'tlui-command-palette-appear 300ms ease-out',
                    overflow: 'hidden',
                    opacity: '0.8', // 80% transparency
                }}
            >
                {/* 搜索输入框 */}
                <div style={{
                    backgroundColor: '#2D2D37',
                    padding: 0,
                }}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Commands..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            height: '38.5px', // 70% of 55px
                            padding: '0 1rem',
                            fontSize: '10px',
                            border: 'none',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            color: '#ffffff',
                            fontFamily: 'inherit',
                            cursor: 'text'
                        }}
                    />
                </div>

                {/* 命令列表 */}
                <div style={{
                    backgroundColor: '#ffffff',
                    maxHeight: '154px', // 调整为显示4个选项 (38.5px * 4)
                    overflowY: filteredCommands.length > 4 ? 'auto' : 'hidden',
                }}>
                    {filteredCommands.length === 0 ? (
                        <div style={{
                            padding: '20px',
                            textAlign: 'center',
                            color: '#6F768F',
                            fontSize: '10px',
                            fontVariant: 'all-small-caps',
                            letterSpacing: '-0.015em'
                        }}>
                            未找到结果
                        </div>
                    ) : (
                        filteredCommands.map((command, index) => (
                            <div
                                key={command.id}
                                onClick={() => command.action()}
                                onMouseEnter={() => setSelectedIndex(index)}
                                style={{
                                    height: '38.5px', // 70% of 55px
                                    padding: '0 1rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: index === selectedIndex ? '#ECF3FD' : 'transparent',
                                    color: index === selectedIndex ? '#2D2D37' : '#4E5061',
                                    transition: 'all 150ms ease-in-out',
                                }}
                            >
                                {/* 图标 */}
                                {command.icon && (
                                    <div style={{
                                        marginRight: '12px',
                                        fontSize: '14px', // 减小字体大小以适应70%
                                        lineHeight: 0,
                                        maxWidth: '16px', // 减小图标宽度
                                        fontFamily: 'system-ui, -apple-system, sans-serif', // 确保使用系统字体显示字形
                                        fontWeight: '400'
                                    }}>
                                        {command.icon}
                                    </div>
                                )}

                                {/* 命令详情 */}
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '12px',
                                        fontWeight: '500'
                                    }}>
                                        {command.label}({command.labelEn.toLowerCase()})
                                    </div>
                                </div>

                                {/* 快捷键 */}
                                <div style={{ textAlign: 'right' }}>
                                    {command.shortcut && (
                                        <span style={{
                                            fontSize: '8px',
                                            color: '#6F768F',
                                            backgroundColor: '#efefef',
                                            border: '1px solid #d1d5dc',
                                            borderRadius: '3px',
                                            padding: '2px 6px',
                                            fontFamily: 'monospace',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            height: '15px'
                                        }}>
                                            {command.shortcut}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 底部帮助栏 */}
                <div style={{
                    backgroundColor: '#fafafa',
                    borderTop: '1px solid #f2f2f2',
                    padding: '0',
                    fontSize: '12px', // 减小字体大小以适应50%高度
                    color: '#6F768F',
                    display: 'flex',
                    alignItems: 'center',
                    height: '20px' // 50% of 40px
                }}>
                    {/* 帮助按钮 */}
                    <div style={{
                        backgroundColor: '#efefef',
                        borderBottomLeftRadius: '6px',
                        padding: '4px 8px', // 减小padding以适应50%高度
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%'
                    }}>
                        <svg
                            style={{ width: '12px', opacity: 0.5 }} // 减小图标尺寸以适应50%高度
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 336c-18 0-32 14-32 32s13.1 32 32 32c17.1 0 32-14 32-32S273.1 336 256 336zM289.1 128h-51.1C199 128 168 159 168 198c0 13 11 24 24 24s24-11 24-24C216 186 225.1 176 237.1 176h51.1C301.1 176 312 186 312 198c0 8-4 14.1-11 18.1L244 251C236 256 232 264 232 272V288c0 13 11 24 24 24S280 301 280 288V286l45.1-28c21-13 34-36 34-60C360 159 329 128 289.1 128z" />
                        </svg>
                    </div>

                    {/* 快捷键提示 */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '12px',
                        flex: 1
                    }}>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                        }}>
                            <span style={{
                                fontFamily: 'monospace',
                                fontWeight: '700',
                                fontSize: '10px'
                            }}>esc</span>
                            关闭
                        </span>
                    </div>
                </div>
            </div>

            {/* 添加CSS动画 */}
            <style>{`
				@keyframes tlui-command-palette-appear {
					0% {
						opacity: 0;
						transform: translate(-50%, -50%) scale(1, 1);
					}
					50% {
						opacity: 1;
						transform: translate(-50%, -50%) scale(1.05, 1.05);
					}
					100% {
						opacity: 1;
						transform: translate(-50%, -50%) scale(1, 1);
					}
				}
			`}</style>
        </>
    )
} 