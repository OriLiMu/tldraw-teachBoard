import type { TLShapeId } from '@tldraw/tlschema'
import type { ShapeAnimation, AnimationConfig } from './types'
import { generateAnimationId } from './utils'

// Transition types
export type TransitionType =
    | 'slide-left'
    | 'slide-right'
    | 'slide-up'
    | 'slide-down'
    | 'fade'
    | 'scale'
    | 'rotate'
    | 'flip'

// Page transition configuration
export interface PageTransitionConfig extends AnimationConfig {
    type: TransitionType
    stagger?: number // Delay between shapes
    reverse?: boolean // For exit transitions
}

// Create enter transition for a shape or group of shapes
export function createEnterTransition(
    targets: TLShapeId | TLShapeId[],
    type: TransitionType = 'fade',
    config?: Partial<PageTransitionConfig>
): ShapeAnimation[] {
    const shapeIds = Array.isArray(targets) ? targets : [targets]
    const stagger = config?.stagger || 0

    return shapeIds.map((shapeId, index) => {
        const baseConfig = {
            id: generateAnimationId(),
            target: shapeId,
            duration: 800,
            delay: index * stagger,
            ease: 'outQuad',
            ...config,
        }

        switch (type) {
            case 'slide-left':
                return {
                    ...baseConfig,
                    type: 'slide' as const,
                    properties: { x: 0, opacity: 1 },
                }
            case 'slide-right':
                return {
                    ...baseConfig,
                    type: 'slide' as const,
                    properties: { x: 0, opacity: 1 },
                }
            case 'slide-up':
                return {
                    ...baseConfig,
                    type: 'slide' as const,
                    properties: { y: 0, opacity: 1 },
                }
            case 'slide-down':
                return {
                    ...baseConfig,
                    type: 'slide' as const,
                    properties: { y: 0, opacity: 1 },
                }
            case 'scale':
                return {
                    ...baseConfig,
                    type: 'scale' as const,
                    properties: { scale: { x: 1, y: 1 }, opacity: 1 },
                }
            case 'rotate':
                return {
                    ...baseConfig,
                    type: 'rotate' as const,
                    properties: { rotation: 0, opacity: 1 },
                }
            case 'flip':
                return {
                    ...baseConfig,
                    type: 'custom' as const,
                    properties: { scale: { x: 1, y: 1 }, opacity: 1 },
                }
            case 'fade':
            default:
                return {
                    ...baseConfig,
                    type: 'fade' as const,
                    properties: { opacity: 1 },
                }
        }
    })
}

// Create exit transition for a shape or group of shapes
export function createExitTransition(
    targets: TLShapeId | TLShapeId[],
    type: TransitionType = 'fade',
    config?: Partial<PageTransitionConfig>
): ShapeAnimation[] {
    const shapeIds = Array.isArray(targets) ? targets : [targets]
    const stagger = config?.stagger || 0
    const reverse = config?.reverse || false

    return shapeIds.map((shapeId, index) => {
        const delay = reverse ? (shapeIds.length - 1 - index) * stagger : index * stagger
        const baseConfig = {
            id: generateAnimationId(),
            target: shapeId,
            duration: 600,
            delay,
            ease: 'inQuad',
            ...config,
        }

        switch (type) {
            case 'slide-left':
                return {
                    ...baseConfig,
                    type: 'slide' as const,
                    properties: { x: -100, opacity: 0 },
                }
            case 'slide-right':
                return {
                    ...baseConfig,
                    type: 'slide' as const,
                    properties: { x: 100, opacity: 0 },
                }
            case 'slide-up':
                return {
                    ...baseConfig,
                    type: 'slide' as const,
                    properties: { y: -100, opacity: 0 },
                }
            case 'slide-down':
                return {
                    ...baseConfig,
                    type: 'slide' as const,
                    properties: { y: 100, opacity: 0 },
                }
            case 'scale':
                return {
                    ...baseConfig,
                    type: 'scale' as const,
                    properties: { scale: { x: 0, y: 0 }, opacity: 0 },
                }
            case 'rotate':
                return {
                    ...baseConfig,
                    type: 'rotate' as const,
                    properties: { rotation: Math.PI * 2, opacity: 0 },
                }
            case 'flip':
                return {
                    ...baseConfig,
                    type: 'custom' as const,
                    properties: { scale: { x: 0, y: 1 }, opacity: 0 },
                }
            case 'fade':
            default:
                return {
                    ...baseConfig,
                    type: 'fade' as const,
                    properties: { opacity: 0 },
                }
        }
    })
}

// Sequential transition (one after another)
export function createSequentialTransition(
    targets: TLShapeId[],
    type: TransitionType = 'fade',
    interval: number = 200,
    config?: Partial<AnimationConfig>
): ShapeAnimation[] {
    return targets.map((shapeId, index) => ({
        id: generateAnimationId(),
        type: 'fade',
        target: shapeId,
        properties: { opacity: 1 },
        delay: index * interval,
        duration: 600,
        ...config,
    }))
}

// Wave transition (ripple effect from center outward)
export function createWaveTransition(
    targets: TLShapeId[],
    centerIndex: number = 0,
    waveSpeed: number = 100,
    config?: Partial<AnimationConfig>
): ShapeAnimation[] {
    return targets.map((shapeId, index) => {
        const distance = Math.abs(index - centerIndex)
        return {
            id: generateAnimationId(),
            type: 'scale',
            target: shapeId,
            properties: { scale: { x: 1, y: 1 }, opacity: 1 },
            delay: distance * waveSpeed,
            duration: 800,
            ease: 'outBack',
            ...config,
        }
    })
}

// Cascade transition (flowing like a waterfall)
export function createCascadeTransition(
    targets: TLShapeId[],
    direction: 'horizontal' | 'vertical' = 'vertical',
    delay: number = 150,
    config?: Partial<AnimationConfig>
): ShapeAnimation[] {
    return targets.map((shapeId, index) => ({
        id: generateAnimationId(),
        type: 'slide',
        target: shapeId,
        properties: direction === 'vertical'
            ? { y: 0, opacity: 1 }
            : { x: 0, opacity: 1 },
        delay: index * delay,
        duration: 1000,
        ease: 'outCubic',
        ...config,
    }))
}

// Randomized transition
export function createRandomTransition(
    targets: TLShapeId[],
    types: TransitionType[] = ['fade', 'scale', 'slide-up'],
    config?: Partial<AnimationConfig>
): ShapeAnimation[] {
    return targets.map((shapeId, index) => {
        const randomType = types[Math.floor(Math.random() * types.length)]
        const randomDelay = Math.random() * 1000

        return createEnterTransition(shapeId, randomType, {
            ...config,
            delay: randomDelay,
        })[0]
    })
}

// Transition presets
export const transitions = {
    createEnterTransition,
    createExitTransition,
    createSequentialTransition,
    createWaveTransition,
    createCascadeTransition,
    createRandomTransition,
} 