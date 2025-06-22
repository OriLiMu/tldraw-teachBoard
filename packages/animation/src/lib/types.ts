import type { TLShape, TLShapeId } from '@tldraw/tlschema'
import type { AnimeJSAnimation, AnimeTimeline } from './anime-integration'

// Animation target types
export interface AnimationTarget {
    shapeId: TLShapeId
    property: string
    from: any
    to: any
}

// Animation configuration for anime.js v4.0.2
export interface AnimationConfig {
    duration?: number
    delay?: number
    ease?: string | ((t: number) => number)  // v4 uses 'ease' instead of 'easing'
    direction?: 'normal' | 'reverse' | 'alternate'
    loop?: boolean | number
    autoplay?: boolean
    // v4.0.2 specific options
    modifier?: (t: number) => number
    composition?: 'none' | 'replace' | 'blend'
}

// Legacy support for v3 API
export interface LegacyAnimationConfig extends AnimationConfig {
    easing?: string | ((t: number) => number)  // Legacy v3 property name
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