import type { TLShapeId } from '@tldraw/tlschema'
import type { ShapeAnimationProps } from './types'

// Generate unique animation ID
export function generateAnimationId(): string {
    return `anim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Validate shape animation properties
export function validateAnimationProps(props: ShapeAnimationProps): boolean {
    if (!props || Object.keys(props).length === 0) {
        return false
    }

    // Check for valid numeric values
    const numericProps = ['x', 'y', 'rotation', 'opacity', 'width', 'height']
    for (const prop of numericProps) {
        if (prop in props && typeof (props as any)[prop] !== 'number') {
            return false
        }
    }

    // Check scale object
    if (props.scale) {
        if (typeof props.scale.x !== 'number' || typeof props.scale.y !== 'number') {
            return false
        }
    }

    return true
}

// Calculate interpolated value
export function interpolate(from: number, to: number, progress: number): number {
    return from + (to - from) * progress
}

// Easing functions
export const easingFunctions = {
    linear: (t: number) => t,
    easeInQuad: (t: number) => t * t,
    easeOutQuad: (t: number) => t * (2 - t),
    easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t: number) => t * t * t,
    easeOutCubic: (t: number) => (--t) * t * t + 1,
    easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
}

// Convert shape IDs to array
export function normalizeShapeIds(target: TLShapeId | TLShapeId[]): TLShapeId[] {
    return Array.isArray(target) ? target : [target]
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

// Deep merge objects
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    const result = { ...target }

    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(
                result[key] || ({} as T[Extract<keyof T, string>]),
                source[key] as Partial<T[Extract<keyof T, string>]>
            )
        } else if (source[key] !== undefined) {
            result[key] = source[key] as T[typeof key]
        }
    }

    return result
} 