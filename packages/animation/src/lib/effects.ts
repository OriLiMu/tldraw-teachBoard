import type { TLShapeId } from '@tldraw/tlschema'
import type { ShapeAnimation, AnimationConfig } from './types'
import { generateAnimationId } from './utils'

// Particle effect configuration
export interface ParticleConfig {
    count: number
    size: { min: number; max: number }
    velocity: { x: number; y: number }
    life: number
    color: string
}

// Trail effect for moving shapes
export function createTrail(
    target: TLShapeId,
    config?: Partial<AnimationConfig & { length: number; fade: boolean }>
): ShapeAnimation {
    return {
        id: generateAnimationId(),
        type: 'custom',
        target,
        properties: { opacity: 0.5 },
        duration: config?.duration || 500,
        ...config,
    }
}

// Glow effect
export function createGlow(
    target: TLShapeId | TLShapeId[],
    intensity: number = 1.5,
    color: string = '#ffff00',
    config?: Partial<AnimationConfig>
): ShapeAnimation {
    return {
        id: generateAnimationId(),
        type: 'custom',
        target,
        properties: { scale: { x: intensity, y: intensity } },
        duration: 800,
        direction: 'alternate',
        loop: true,
        ...config,
    }
}

// Explode effect (shapes fly outward)
export function createExplode(
    target: TLShapeId[],
    force: number = 100,
    config?: Partial<AnimationConfig>
): ShapeAnimation[] {
    return target.map((shapeId, index) => {
        const angle = (index / target.length) * Math.PI * 2
        const x = Math.cos(angle) * force
        const y = Math.sin(angle) * force

        return {
            id: generateAnimationId(),
            type: 'custom',
            target: shapeId,
            properties: { x, y, rotation: angle },
            duration: 1000,
            easing: 'easeOutQuad',
            ...config,
        }
    })
}

// Implode effect (shapes converge to center)
export function createImplode(
    target: TLShapeId[],
    centerX: number,
    centerY: number,
    config?: Partial<AnimationConfig>
): ShapeAnimation[] {
    return target.map((shapeId) => ({
        id: generateAnimationId(),
        type: 'custom',
        target: shapeId,
        properties: { x: centerX, y: centerY, scale: { x: 0, y: 0 } },
        duration: 800,
        easing: 'easeInQuad',
        ...config,
    }))
}

// Ripple effect (waves emanating from center)
export function createRipple(
    centerX: number,
    centerY: number,
    targets: TLShapeId[],
    waveSpeed: number = 50,
    config?: Partial<AnimationConfig>
): ShapeAnimation[] {
    return targets.map((shapeId, index) => ({
        id: generateAnimationId(),
        type: 'custom',
        target: shapeId,
        properties: { scale: { x: 1.2, y: 1.2 } },
        delay: index * waveSpeed,
        duration: 400,
        direction: 'alternate',
        ...config,
    }))
}

// Spiral effect
export function createSpiral(
    targets: TLShapeId[],
    centerX: number,
    centerY: number,
    radius: number = 100,
    config?: Partial<AnimationConfig>
): ShapeAnimation[] {
    return targets.map((shapeId, index) => {
        const angle = (index / targets.length) * Math.PI * 4 // Two full rotations
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        return {
            id: generateAnimationId(),
            type: 'custom',
            target: shapeId,
            properties: { x, y, rotation: angle },
            duration: 2000,
            delay: index * 100,
            easing: 'easeInOutQuad',
            ...config,
        }
    })
}

// Morphing effect (for shape transformation)
export function createMorph(
    target: TLShapeId,
    fromProps: Record<string, any>,
    toProps: Record<string, any>,
    config?: Partial<AnimationConfig>
): ShapeAnimation {
    return {
        id: generateAnimationId(),
        type: 'custom',
        target,
        properties: toProps,
        duration: 1500,
        easing: 'easeInOutCubic',
        ...config,
    }
}

// Color transition effect
export function createColorTransition(
    target: TLShapeId | TLShapeId[],
    fromColor: string,
    toColor: string,
    config?: Partial<AnimationConfig>
): ShapeAnimation {
    return {
        id: generateAnimationId(),
        type: 'custom',
        target,
        properties: { /* color properties would be handled by the animation system */ },
        duration: 1000,
        ...config,
    }
}

// Effects collection
export const effects = {
    createTrail,
    createGlow,
    createExplode,
    createImplode,
    createRipple,
    createSpiral,
    createMorph,
    createColorTransition,
} 