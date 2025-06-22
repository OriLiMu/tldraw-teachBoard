import type { TLShapeId } from '@tldraw/tlschema'
import type { ShapeAnimation, AnimationConfig } from './types'
import { generateAnimationId } from './utils'

// Default animation configuration
const DEFAULT_CONFIG: AnimationConfig = {
    duration: 1000,
    delay: 0,
    easing: 'easeOutQuad',
    direction: 'normal',
    loop: false,
    autoplay: true,
}

// Fade in animation
export function fadeIn(
    target: TLShapeId | TLShapeId[],
    config?: Partial<AnimationConfig>
): ShapeAnimation {
    return {
        id: generateAnimationId(),
        type: 'fade',
        target,
        properties: { opacity: 1 },
        ...DEFAULT_CONFIG,
        ...config,
    }
}

// Fade out animation
export function fadeOut(
    target: TLShapeId | TLShapeId[],
    config?: Partial<AnimationConfig>
): ShapeAnimation {
    return {
        id: generateAnimationId(),
        type: 'fade',
        target,
        properties: { opacity: 0 },
        ...DEFAULT_CONFIG,
        ...config,
    }
}

// Slide animation
export function slideIn(
    target: TLShapeId | TLShapeId[],
    direction: 'left' | 'right' | 'up' | 'down' = 'left',
    distance: number = 100,
    config?: Partial<AnimationConfig>
): ShapeAnimation {
    const properties = {
        x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
        y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
    }

    return {
        id: generateAnimationId(),
        type: 'slide',
        target,
        properties,
        ...DEFAULT_CONFIG,
        ...config,
    }
}

// Scale animation
export function scaleIn(
    target: TLShapeId | TLShapeId[],
    fromScale: number = 0,
    toScale: number = 1,
    config?: Partial<AnimationConfig>
): ShapeAnimation {
    return {
        id: generateAnimationId(),
        type: 'scale',
        target,
        properties: { scale: { x: toScale, y: toScale } },
        ...DEFAULT_CONFIG,
        ...config,
    }
}

// Rotation animation
export function rotate(
    target: TLShapeId | TLShapeId[],
    degrees: number = 360,
    config?: Partial<AnimationConfig>
): ShapeAnimation {
    return {
        id: generateAnimationId(),
        type: 'rotate',
        target,
        properties: { rotation: degrees * (Math.PI / 180) }, // Convert to radians
        ...DEFAULT_CONFIG,
        ...config,
    }
}

// Bounce animation
export function bounce(
    target: TLShapeId | TLShapeId[],
    height: number = 20,
    config?: Partial<AnimationConfig>
): ShapeAnimation {
    return {
        id: generateAnimationId(),
        type: 'bounce',
        target,
        properties: { y: -height },
        ...DEFAULT_CONFIG,
        easing: 'easeOutBounce',
        direction: 'alternate',
        loop: 3,
        ...config,
    }
}

// Pulse animation (scale up and down)
export function pulse(
    target: TLShapeId | TLShapeId[],
    scale: number = 1.1,
    config?: Partial<AnimationConfig>
): ShapeAnimation {
    return {
        id: generateAnimationId(),
        type: 'pulse',
        target,
        properties: { scale: { x: scale, y: scale } },
        ...DEFAULT_CONFIG,
        duration: 600,
        direction: 'alternate',
        loop: true,
        ...config,
    }
}

// Shake animation
export function shake(
    target: TLShapeId | TLShapeId[],
    intensity: number = 10,
    config?: Partial<AnimationConfig>
): ShapeAnimation {
    return {
        id: generateAnimationId(),
        type: 'shake',
        target,
        properties: { x: intensity },
        ...DEFAULT_CONFIG,
        duration: 100,
        direction: 'alternate',
        loop: 6,
        ...config,
    }
}

// Move to position animation
export function moveTo(
    target: TLShapeId | TLShapeId[],
    x: number,
    y: number,
    config?: Partial<AnimationConfig>
): ShapeAnimation {
    return {
        id: generateAnimationId(),
        type: 'custom',
        target,
        properties: { x, y },
        ...DEFAULT_CONFIG,
        ...config,
    }
}

// Combined animation presets
export const presets = {
    fadeIn,
    fadeOut,
    slideIn,
    scaleIn,
    rotate,
    bounce,
    pulse,
    shake,
    moveTo,
} 