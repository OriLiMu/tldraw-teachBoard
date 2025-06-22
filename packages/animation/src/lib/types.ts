import type { TLShape, TLShapeId } from '@tldraw/tlschema'

// Animation target types
export interface AnimationTarget {
    shapeId: TLShapeId
    property: string
    from: any
    to: any
}

// Animation configuration
export interface AnimationConfig {
    duration?: number
    delay?: number
    easing?: string | ((t: number) => number)
    direction?: 'normal' | 'reverse' | 'alternate'
    loop?: boolean | number
    autoplay?: boolean
}

// Shape animation properties
export interface ShapeAnimationProps {
    x?: number
    y?: number
    rotation?: number
    opacity?: number
    width?: number
    height?: number
    scale?: { x: number; y: number }
}

// Animation types
export type AnimationType =
    | 'fade'
    | 'slide'
    | 'scale'
    | 'rotate'
    | 'bounce'
    | 'pulse'
    | 'shake'
    | 'custom'

// Animation event types
export interface AnimationEvents {
    onStart?: () => void
    onUpdate?: (progress: number) => void
    onComplete?: () => void
    onPause?: () => void
    onResume?: () => void
}

// Complete animation definition
export interface ShapeAnimation extends AnimationConfig, AnimationEvents {
    id: string
    type: AnimationType
    target: TLShapeId | TLShapeId[]
    properties: ShapeAnimationProps
    timeline?: boolean
    startTime?: number // Added for internal use
}

// Animation group for coordinated animations
export interface AnimationGroup {
    id: string
    animations: ShapeAnimation[]
    config?: AnimationConfig
} 