import { getLicenseKey } from '@tldraw/dotcom-shared'
import {
	DefaultContextMenu,
	DefaultContextMenuContent,
	DefaultDebugMenu,
	DefaultDebugMenuContent,
	ExampleDialog,
	TLComponents,
	Tldraw,
	TldrawUiMenuActionCheckboxItem,
	TldrawUiMenuActionItem,
	TldrawUiMenuGroup,
	TldrawUiMenuItem,
	track,
	useDialogs,
	useEditor,
} from 'tldraw'
import 'tldraw/tldraw.css'
import { animate } from 'animejs'
import { trackedShapes, useDebugging } from '../hooks/useDebugging'
import { usePerformance } from '../hooks/usePerformance'
import { A11yResultTable } from './a11y'
import { getDiff } from './diff'

const ContextMenu = track(() => {
	const editor = useEditor()
	const oneShape = editor.getOnlySelectedShape()
	const selectedShapes = editor.getSelectedShapes()
	const tracked = trackedShapes.get()
	return (
		<DefaultContextMenu>
			<DefaultContextMenuContent />
			{selectedShapes.length > 0 && (
				<TldrawUiMenuGroup id="debugging">
					<TldrawUiMenuActionItem actionId="log-shapes" />
					{oneShape && (
						<TldrawUiMenuActionCheckboxItem
							checked={tracked.includes(oneShape.id)}
							actionId="track-changes"
						/>
					)}
				</TldrawUiMenuGroup>
			)}
		</DefaultContextMenu>
	)
})

function A11yAudit() {
	const { addDialog } = useDialogs()

	const runA11yAudit = async () => {
		const axe = (await import('axe-core')).default
		axe.run(document, {}, (err, results) => {
			if (err) throw err

			// eslint-disable-next-line no-console
			console.debug('[a11y]:', results)

			addDialog({
				component: ({ onClose }) => (
					<ExampleDialog
						body={<A11yResultTable results={results} />}
						title="Accessibility Audit Results"
						maxWidth="80vw"
						cancel="Close"
						confirm="Ok"
						onCancel={() => onClose()}
						onContinue={() => onClose()}
					/>
				),
				onClose: () => {
					void null
				},
			})
		})
	}

	return <TldrawUiMenuItem id="a11y-audit" onSelect={runA11yAudit} label={'A11y audit'} />
}

const components: TLComponents = {
	ContextMenu,
	DebugMenu: () => (
		<DefaultDebugMenu>
			<A11yAudit />
			<DefaultDebugMenuContent />
		</DefaultDebugMenu>
	),
}

function afterChangeHandler(prev: any, next: any) {
	const tracked = trackedShapes.get()
	if (tracked.includes(next.id)) {
		// eslint-disable-next-line no-console
		console.table(getDiff(prev, next))
	}
}

function startRectangleAnimation(editor: any, rectangleId: any) {
	// 创建一个对象来存储动画数据
	const animationData = { x: 100 };

	// 使用 anime.js 创建左右移动动画
	const animation = animate(animationData, {
		x: 800, // 目标位置
		duration: 3000, // 动画持续时间 3 秒
		ease: 'inOutQuad',
		direction: 'alternate', // 来回移动
		loop: true, // 无限循环
		onUpdate: function () {
			// 在动画更新时移动矩形
			const rectangle = editor.getShape(rectangleId);
			if (rectangle) {
				editor.updateShape({
					...rectangle,
					x: animationData.x,
				});
			}
		}
	});

	console.log('矩形动画已开始 - 使用 anime.js 从左到右移动');

	// 返回停止动画的函数
	return () => {
		if (animation && animation.cancel) {
			animation.cancel();
		}
	};
}

export default function Develop() {
	const performanceOverrides = usePerformance()
	const debuggingOverrides = useDebugging()

	return (
		<div className="tldraw__editor">
			<Tldraw
				licenseKey={getLicenseKey()}
				overrides={[performanceOverrides, debuggingOverrides]}
				persistenceKey="example"
				onMount={(editor) => {
					; (window as any).app = editor
						; (window as any).editor = editor

					let rectangleId: any = null;

					// 检查是否已经存在矩形，如果没有则创建
					const existingShapes = editor.getCurrentPageShapes();
					const existingRectangle = existingShapes.find(shape =>
						shape.type === 'geo' && (shape.props as any).geo === 'rectangle'
					);

					if (!existingRectangle) {
						editor.createShape({
							type: 'geo',
							x: 100,
							y: 100,
							props: {
								w: 300,
								h: 200,
								geo: 'rectangle',
								color: 'blue',
								fill: 'solid',
								size: 'm'
							}
						});

						// 获取刚创建的矩形
						const newShapes = editor.getCurrentPageShapes();
						const newRectangle = newShapes.find(shape =>
							shape.type === 'geo' && (shape.props as any).geo === 'rectangle'
						);
						rectangleId = newRectangle?.id;
						console.log('矩形已自动创建');
					} else {
						rectangleId = existingRectangle.id;
						console.log('页面已存在矩形，跳过创建');
					}

					// 调整视图以显示所有内容
					editor.zoomToFit();

					// 添加动画功能
					if (rectangleId) {
						// 等待一秒后开始动画
						setTimeout(() => {
							startRectangleAnimation(editor, rectangleId);
						}, 1000);
					}

					const dispose = editor.store.sideEffects.registerAfterChangeHandler(
						'shape',
						afterChangeHandler
					)
					return () => {
						dispose()
					}
				}}
				components={components}
			></Tldraw>
		</div>
	)
}
