import { GeoShapeGeoStyle, useEditor } from '@tldraw/editor'
import React from 'react'
import { useMenuClipboardEvents } from '../../hooks/useClipboardEvents'

// 命令面板相关的类型定义
interface CommandPaletteCommand {
    id: string
    label: string
    description?: string
    category: string
    kbd?: string
    icon?: string
    action: () => void
}

// 命令面板组件
/** @public @react */
export function CommandPalette() {
    const editor = useEditor()
    const { copy, paste } = useMenuClipboardEvents()
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // 定义所有可用的命令
    const commands: CommandPaletteCommand[] = React.useMemo(() => [
        // 工具命令
        {
            id: 'select-tool',
            label: '选择工具',
            description: '切换到选择工具',
            category: '工具',
            kbd: 'V',
            action: () => editor.setCurrentTool('select')
        },
        {
            id: 'draw-tool',
            label: '绘画工具',
            description: '切换到绘画工具',
            category: '工具',
            kbd: 'D',
            action: () => editor.setCurrentTool('draw')
        },
        {
            id: 'rectangle-tool',
            label: '矩形工具',
            description: '切换到矩形工具',
            category: '工具',
            kbd: 'R',
            action: () => {
                editor.setCurrentTool('geo')
                editor.setStyleForNextShapes(GeoShapeGeoStyle, 'rectangle')
            }
        },
        {
            id: 'ellipse-tool',
            label: '椭圆工具',
            description: '切换到椭圆工具',
            category: '工具',
            kbd: 'O',
            action: () => {
                editor.setCurrentTool('geo')
                editor.setStyleForNextShapes(GeoShapeGeoStyle, 'ellipse')
            }
        },
        {
            id: 'arrow-tool',
            label: '箭头工具',
            description: '切换到箭头工具',
            category: '工具',
            kbd: 'A',
            action: () => editor.setCurrentTool('arrow')
        },
        {
            id: 'text-tool',
            label: '文本工具',
            description: '切换到文本工具',
            category: '工具',
            kbd: 'T',
            action: () => editor.setCurrentTool('text')
        },
        {
            id: 'eraser-tool',
            label: '橡皮擦工具',
            description: '切换到橡皮擦工具',
            category: '工具',
            kbd: 'E',
            action: () => editor.setCurrentTool('eraser')
        },
        {
            id: 'hand-tool',
            label: '手形工具',
            description: '切换到手形工具',
            category: '工具',
            kbd: 'H',
            action: () => editor.setCurrentTool('hand')
        },

        // 编辑命令
        {
            id: 'undo',
            label: '撤销',
            description: '撤销上一个操作',
            category: '编辑',
            kbd: 'Ctrl+Z',
            action: () => editor.undo()
        },
        {
            id: 'redo',
            label: '重做',
            description: '重做上一个操作',
            category: '编辑',
            kbd: 'Ctrl+Y',
            action: () => editor.redo()
        },
        {
            id: 'copy',
            label: '复制',
            description: '复制选中的形状',
            category: '编辑',
            kbd: 'Ctrl+C',
            action: () => copy('menu')
        },
        {
            id: 'paste',
            label: '粘贴',
            description: '粘贴剪贴板中的内容',
            category: '编辑',
            kbd: 'Ctrl+V',
            action: () => {
                navigator.clipboard?.read().then((clipboardItems) => {
                    paste(clipboardItems, 'menu')
                }).catch(() => {
                    console.log('粘贴失败')
                })
            }
        },
        {
            id: 'select-all',
            label: '全选',
            description: '选择画板上的所有形状',
            category: '编辑',
            kbd: 'Ctrl+A',
            action: () => editor.selectAll()
        },
        {
            id: 'delete',
            label: '删除',
            description: '删除选中的形状',
            category: '编辑',
            kbd: 'Delete',
            action: () => editor.deleteShapes(editor.getSelectedShapeIds())
        },
        {
            id: 'duplicate',
            label: '复制',
            description: '复制选中的形状',
            category: '编辑',
            kbd: 'Ctrl+D',
            action: () => editor.duplicateShapes(editor.getSelectedShapeIds())
        },

        // 视图命令
        {
            id: 'zoom-in',
            label: '放大',
            description: '放大视图',
            category: '视图',
            kbd: 'Ctrl+=',
            action: () => editor.zoomIn()
        },
        {
            id: 'zoom-out',
            label: '缩小',
            description: '缩小视图',
            category: '视图',
            kbd: 'Ctrl+-',
            action: () => editor.zoomOut()
        },
        {
            id: 'zoom-to-fit',
            label: '适应窗口',
            description: '缩放以适应所有内容',
            category: '视图',
            kbd: 'Shift+1',
            action: () => editor.zoomToFit()
        },
        {
            id: 'zoom-to-selection',
            label: '缩放到选择',
            description: '缩放以适应选中的形状',
            category: '视图',
            kbd: 'Shift+2',
            action: () => editor.zoomToSelection()
        },
        {
            id: 'reset-zoom',
            label: '重置缩放',
            description: '将缩放重置为100%',
            category: '视图',
            kbd: 'Shift+0',
            action: () => editor.resetZoom()
        },

        // 自定义命令
        {
            id: 'clear-board',
            label: '清空画板',
            description: '删除画板上的所有形状',
            category: '自定义',
            action: () => {
                const allShapeIds = Array.from(editor.getCurrentPageShapeIds())
                if (allShapeIds.length > 0) {
                    editor.deleteShapes(allShapeIds)
                }
            }
        },
        {
            id: 'create-animated-rectangle',
            label: '创建动画矩形',
            description: '清空画板并创建一个带动画的矩形',
            category: '自定义',
            action: () => {
                // 触发自定义按钮的功能
                const customButton = document.querySelector('[title="清空画板并创建动画矩形"]') as HTMLButtonElement
                if (customButton) {
                    customButton.click()
                }
            }
        }
    ], [editor, copy, paste])

    // 过滤命令
    const filteredCommands = React.useMemo(() => {
        if (!searchQuery.trim()) return commands

        const query = searchQuery.toLowerCase()
        return commands.filter(command =>
            command.label.toLowerCase().includes(query) ||
            command.description?.toLowerCase().includes(query) ||
            command.category.toLowerCase().includes(query)
        )
    }, [commands, searchQuery])

    // 按类别分组
    const groupedCommands = React.useMemo(() => {
        const groups: Record<string, CommandPaletteCommand[]> = {}
        filteredCommands.forEach(command => {
            if (!groups[command.category]) {
                groups[command.category] = []
            }
            groups[command.category].push(command)
        })
        return groups
    }, [filteredCommands])

    // 键盘事件处理
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+K 或 Cmd+K 打开命令面板
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(true)
                setSearchQuery('')
                setSelectedIndex(0)
                return
            }

            // Escape 关闭命令面板
            if (e.key === 'Escape' && isOpen) {
                e.preventDefault()
                setIsOpen(false)
                return
            }

            // 在命令面板打开时的导航
            if (isOpen) {
                if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
                    e.preventDefault()
                    setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
                } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
                    e.preventDefault()
                    setSelectedIndex(prev => Math.max(prev - 1, 0))
                } else if (e.key === 'Enter') {
                    e.preventDefault()
                    const selectedCommand = filteredCommands[selectedIndex]
                    if (selectedCommand) {
                        selectedCommand.action()
                        setIsOpen(false)
                    }
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, filteredCommands, selectedIndex])

    // 自动聚焦输入框
    React.useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    // 重置选中索引当搜索结果改变时
    React.useEffect(() => {
        setSelectedIndex(0)
    }, [searchQuery])

    if (!isOpen) return null

    return (
        <div className="tlui-command-palette-overlay">
            <div className="tlui-command-palette">
                <div className="tlui-command-palette-header">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="搜索命令... (输入命令名称、描述或类别)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="tlui-command-palette-input"
                    />
                </div>

                <div className="tlui-command-palette-content">
                    {Object.keys(groupedCommands).length === 0 ? (
                        <div className="tlui-command-palette-empty">
                            没有找到匹配的命令
                        </div>
                    ) : (
                        Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                            <div key={category} className="tlui-command-palette-group">
                                <div className="tlui-command-palette-group-title">{category}</div>
                                {categoryCommands.map((command, index) => {
                                    const globalIndex = filteredCommands.indexOf(command)
                                    return (
                                        <div
                                            key={command.id}
                                            className={`tlui-command-palette-item ${globalIndex === selectedIndex ? 'tlui-command-palette-item-selected' : ''}`}
                                            onClick={() => {
                                                command.action()
                                                setIsOpen(false)
                                            }}
                                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                                        >
                                            <div className="tlui-command-palette-item-content">
                                                <div className="tlui-command-palette-item-main">
                                                    <span className="tlui-command-palette-item-label">{command.label}</span>
                                                    {command.description && (
                                                        <span className="tlui-command-palette-item-description">{command.description}</span>
                                                    )}
                                                </div>
                                                {command.kbd && (
                                                    <div className="tlui-command-palette-item-kbd">{command.kbd}</div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ))
                    )}
                </div>

                <div className="tlui-command-palette-footer">
                    <span>↑↓ 导航</span>
                    <span>Tab 下一个</span>
                    <span>Enter 执行</span>
                    <span>Esc 关闭</span>
                </div>
            </div>
        </div>
    )
} 