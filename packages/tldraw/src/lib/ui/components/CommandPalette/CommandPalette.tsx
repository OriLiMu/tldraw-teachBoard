import React, { useState, useEffect, useRef } from 'react'
import { useEditor } from '@tldraw/editor'
import { Dialog as _Dialog } from 'radix-ui'
import { GeoShapeGeoStyle } from '@tldraw/editor'

// 命令类型定义
interface Command {
    id: string
    label: string
    description: string
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

    // 定义3个测试命令
    const commands: Command[] = [
        {
            id: 'create-rectangle',
            label: '创建矩形',
            description: '在画板上创建一个新的矩形形状',
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
            id: 'clear-canvas',
            label: '清空画板',
            description: '删除画板上的所有形状和内容',
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
            description: '缩放画板以适应所有内容到视图中',
            category: '视图',
            shortcut: 'Shift+1',
            icon: '⌕',
            action: () => {
                editor.zoomToFit()
                setIsOpen(false)
            }
        }
    ]

    // 过滤命令
    const filteredCommands = commands.filter(command =>
        command.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
            {/* 背景遮罩 */}
            <div
                className="tlui-command-palette-overlay"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    zIndex: 'var(--layer-overlays)',
                }}
                onClick={() => setIsOpen(false)}
            />

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
                        placeholder="输入命令..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            height: '55px',
                            padding: '0 1rem',
                            fontSize: '16px',
                            border: 'none',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            color: '#ffffff',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                {/* 命令列表 */}
                <div style={{
                    backgroundColor: '#ffffff',
                    maxHeight: '115px', // 减小高度以适应70%大小 (约55px * 2.1)
                    overflowY: filteredCommands.length > 2 ? 'auto' : 'hidden',
                }}>
                    {filteredCommands.length === 0 ? (
                        <div style={{
                            padding: '20px',
                            textAlign: 'center',
                            color: '#6F768F',
                            fontSize: '14px',
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
                                    height: '55px',
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
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '2px'
                                    }}>
                                        {command.label}
                                    </div>
                                    {/* 悬停时显示描述 */}
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#6F768F',
                                        height: index === selectedIndex ? 'auto' : '0',
                                        opacity: index === selectedIndex ? 1 : 0,
                                        transform: index === selectedIndex ? 'translateY(0)' : 'translateY(-5px)',
                                        transition: 'transform 150ms, opacity 75ms',
                                        overflow: 'hidden'
                                    }}>
                                        {command.description}
                                    </div>
                                </div>

                                {/* 快捷键 */}
                                <div style={{ textAlign: 'right' }}>
                                    {command.shortcut && (
                                        <span style={{
                                            fontSize: '12px',
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
                    fontSize: '14px',
                    color: '#6F768F',
                    display: 'flex',
                    alignItems: 'center',
                    height: '40px'
                }}>
                    {/* 帮助按钮 */}
                    <div style={{
                        backgroundColor: '#efefef',
                        borderBottomLeftRadius: '6px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%'
                    }}>
                        <svg
                            style={{ width: '18px', opacity: 0.5 }}
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
                        gap: '16px',
                        marginLeft: '16px',
                        flex: 1
                    }}>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                        }}>
                            <svg style={{ width: '12px', marginRight: '2px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M119.7 409.6l-112-104c-10.23-9.5-10.23-25.69 0-35.19l112-104c6.984-6.484 17.17-8.219 25.92-4.406s14.41 12.45 14.41 22L159.1 264h304V56c0-13.25 10.75-24 24-24s24 10.75 24 24V288c0 13.25-10.75 24-24 24h-328l.0015 80c0 9.547-5.656 18.19-14.41 22S126.7 416.1 119.7 409.6z" />
                            </svg>
                            选择
                        </span>

                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                        }}>
                            <svg style={{ width: '12px', marginRight: '2px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                                <path d="M254 366.4C250.2 357.7 241.5 352 232 352H152V160h80c9.547 0 18.19-5.656 21.1-14.41c3.813-8.75 2.078-18.94-4.406-25.92l-104-112C141 2.781 134.5 .3359 128 .3359s-13.05 2.445-17.59 7.336l-104 112C-.0781 126.7-1.813 136.8 1.999 145.6C5.812 154.3 14.45 160 24 160h80v192H24c-9.547 0-18.19 5.656-22 14.41s-2.078 18.94 4.406 25.92l103.1 112c4.547 4.891 11.07 7.336 17.6 7.336s13.05-2.445 17.59-7.336l104-112C256.1 385.3 257.8 375.2 254 366.4z" />
                            </svg>
                            导航
                        </span>

                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                        }}>
                            <span style={{
                                fontFamily: 'monospace',
                                fontWeight: '700',
                                fontSize: '12px'
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