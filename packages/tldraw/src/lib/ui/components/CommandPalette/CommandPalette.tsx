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
            description: '在画板上创建一个新的矩形',
            category: '形状',
            shortcut: 'R',
            action: () => {
                editor.setCurrentTool('geo')
                editor.setStyleForNextShapes(GeoShapeGeoStyle, 'rectangle')
                setIsOpen(false)
            }
        },
        {
            id: 'clear-canvas',
            label: '清空画板',
            description: '删除画板上的所有形状',
            category: '编辑',
            shortcut: 'Ctrl+A, Del',
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
            description: '缩放画板以适应所有内容',
            category: '视图',
            shortcut: 'Shift+1',
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
        <_Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <_Dialog.Portal>
                <_Dialog.Overlay className="tlui-dialog__overlay" />
                <_Dialog.Content
                    className="tlui-command-palette"
                    style={{
                        position: 'fixed',
                        top: '20%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '600px',
                        maxWidth: '90vw',
                        backgroundColor: 'var(--color-panel)',
                        borderRadius: 'var(--radius-3)',
                        boxShadow: 'var(--shadow-3)',
                        border: '1px solid var(--color-muted-1)',
                        zIndex: 'var(--layer-overlays)',
                    }}
                >
                    {/* 搜索输入框 */}
                    <div style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--color-muted-1)'
                    }}>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="输入命令或搜索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '16px',
                                border: 'none',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                color: 'var(--color-text)',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    {/* 命令列表 */}
                    <div style={{
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                        {filteredCommands.length === 0 ? (
                            <div style={{
                                padding: '20px',
                                textAlign: 'center',
                                color: 'var(--color-text-3)',
                                fontSize: '14px'
                            }}>
                                未找到匹配的命令
                            </div>
                        ) : (
                            filteredCommands.map((command, index) => (
                                <div
                                    key={command.id}
                                    onClick={() => command.action()}
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        backgroundColor: index === selectedIndex ? 'var(--color-muted-2)' : 'transparent',
                                        borderLeft: index === selectedIndex ? '3px solid var(--color-accent)' : '3px solid transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <div>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: 'var(--color-text)',
                                            marginBottom: '2px'
                                        }}>
                                            {command.label}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: 'var(--color-text-3)'
                                        }}>
                                            {command.description}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <span style={{
                                            fontSize: '10px',
                                            color: 'var(--color-text-3)',
                                            backgroundColor: 'var(--color-muted-1)',
                                            padding: '2px 6px',
                                            borderRadius: '4px'
                                        }}>
                                            {command.category}
                                        </span>
                                        {command.shortcut && (
                                            <span style={{
                                                fontSize: '10px',
                                                color: 'var(--color-text-3)',
                                                fontFamily: 'monospace'
                                            }}>
                                                {command.shortcut}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* 底部提示 */}
                    <div style={{
                        padding: '8px 16px',
                        borderTop: '1px solid var(--color-muted-1)',
                        fontSize: '11px',
                        color: 'var(--color-text-3)',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <span>↑↓ 导航 • Tab 循环 • Enter 执行</span>
                        <span>Esc 关闭</span>
                    </div>
                </_Dialog.Content>
            </_Dialog.Portal>
        </_Dialog.Root>
    )
} 