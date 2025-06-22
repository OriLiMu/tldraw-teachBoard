import { useEffect, useRef, useState, useCallback } from 'react'
import { useEditor } from '@tldraw/editor'
import type { TLShapeId } from '@tldraw/tlschema'
import type { ShapeAnimation, AnimationConfig } from './types'
import { AnimationSystem } from './AnimationSystem'
import * as animations from './animations'
import * as effects from './effects'
import * as transitions from './transitions'

// Hook to use the animation system
export function useAnimationSystem() {
    const editor = useEditor()
    const animationSystemRef = useRef<AnimationSystem | null>(null)

    useEffect(() => {
        if (editor && !animationSystemRef.current) {
            animationSystemRef.current = new AnimationSystem(editor)
        }

        return () => {
            if (animationSystemRef.current) {
                animationSystemRef.current.destroy()
                animationSystemRef.current = null
            }
        }
    }, [editor])

    return animationSystemRef.current
}

// Hook for animating shapes
export function useShapeAnimation() {
    const animationSystem = useAnimationSystem()
    const [activeAnimations, setActiveAnimations] = useState<ShapeAnimation[]>([])

    // Update active animations when they change
    useEffect(() => {
        if (!animationSystem) return

        const updateAnimations = () => {
            setActiveAnimations(animationSystem.getActiveAnimations())
        }

        const unsubscribeStart = animationSystem.on('animationStart', updateAnimations)
        const unsubscribeComplete = animationSystem.on('animationComplete', updateAnimations)

        updateAnimations() // Initial load

        return () => {
            unsubscribeStart()
            unsubscribeComplete()
        }
    }, [animationSystem])

    // Animation control functions
    const animate = useCallback((animation: ShapeAnimation) => {
        return animationSystem?.animate(animation) || ''
    }, [animationSystem])

    const stop = useCallback((animationId: string) => {
        return animationSystem?.stop(animationId) || false
    }, [animationSystem])

    const stopForShapes = useCallback((shapeIds: TLShapeId | TLShapeId[]) => {
        animationSystem?.stopForShapes(shapeIds)
    }, [animationSystem])

    const stopAll = useCallback(() => {
        animationSystem?.stopAll()
    }, [animationSystem])

    const pause = useCallback(() => {
        animationSystem?.pause()
    }, [animationSystem])

    const resume = useCallback(() => {
        animationSystem?.resume()
    }, [animationSystem])

    // Convenience methods for common animations
    const fadeIn = useCallback((target: TLShapeId | TLShapeId[], config?: Partial<AnimationConfig>) => {
        if (!animationSystem) return ''
        return animationSystem.animate(animations.fadeIn(target, config))
    }, [animationSystem])

    const fadeOut = useCallback((target: TLShapeId | TLShapeId[], config?: Partial<AnimationConfig>) => {
        if (!animationSystem) return ''
        return animationSystem.animate(animations.fadeOut(target, config))
    }, [animationSystem])

    const slideIn = useCallback((
        target: TLShapeId | TLShapeId[],
        direction?: 'left' | 'right' | 'up' | 'down',
        distance?: number,
        config?: Partial<AnimationConfig>
    ) => {
        if (!animationSystem) return ''
        return animationSystem.animate(animations.slideIn(target, direction, distance, config))
    }, [animationSystem])

    const scaleIn = useCallback((
        target: TLShapeId | TLShapeId[],
        fromScale?: number,
        toScale?: number,
        config?: Partial<AnimationConfig>
    ) => {
        if (!animationSystem) return ''
        return animationSystem.animate(animations.scaleIn(target, fromScale, toScale, config))
    }, [animationSystem])

    const rotate = useCallback((
        target: TLShapeId | TLShapeId[],
        degrees?: number,
        config?: Partial<AnimationConfig>
    ) => {
        if (!animationSystem) return ''
        return animationSystem.animate(animations.rotate(target, degrees, config))
    }, [animationSystem])

    const bounce = useCallback((
        target: TLShapeId | TLShapeId[],
        height?: number,
        config?: Partial<AnimationConfig>
    ) => {
        if (!animationSystem) return ''
        return animationSystem.animate(animations.bounce(target, height, config))
    }, [animationSystem])

    const pulse = useCallback((
        target: TLShapeId | TLShapeId[],
        scale?: number,
        config?: Partial<AnimationConfig>
    ) => {
        if (!animationSystem) return ''
        return animationSystem.animate(animations.pulse(target, scale, config))
    }, [animationSystem])

    const shake = useCallback((
        target: TLShapeId | TLShapeId[],
        intensity?: number,
        config?: Partial<AnimationConfig>
    ) => {
        if (!animationSystem) return ''
        return animationSystem.animate(animations.shake(target, intensity, config))
    }, [animationSystem])

    const moveTo = useCallback((
        target: TLShapeId | TLShapeId[],
        x: number,
        y: number,
        config?: Partial<AnimationConfig>
    ) => {
        if (!animationSystem) return ''
        return animationSystem.animate(animations.moveTo(target, x, y, config))
    }, [animationSystem])

    return {
        // System controls
        animate,
        stop,
        stopForShapes,
        stopAll,
        pause,
        resume,

        // State
        activeAnimations,
        isAnimating: activeAnimations.length > 0,
        animationCount: activeAnimations.length,

        // Convenience animations
        fadeIn,
        fadeOut,
        slideIn,
        scaleIn,
        rotate,
        bounce,
        pulse,
        shake,
        moveTo,

        // Advanced features
        effects,
        transitions,

        // Direct access to system
        animationSystem,
    }
}

// Hook for animation events
export function useAnimationEvents() {
    const animationSystem = useAnimationSystem()
    const [events, setEvents] = useState<{
        started: ShapeAnimation[]
        completed: ShapeAnimation[]
        paused: boolean
    }>({
        started: [],
        completed: [],
        paused: false,
    })

    useEffect(() => {
        if (!animationSystem) return

        const unsubscribeStart = animationSystem.on('animationStart', (animation) => {
            setEvents(prev => ({
                ...prev,
                started: [...prev.started, animation]
            }))
        })

        const unsubscribeComplete = animationSystem.on('animationComplete', (animation) => {
            setEvents(prev => ({
                ...prev,
                completed: [...prev.completed, animation]
            }))
        })

        const unsubscribePause = animationSystem.on('systemPause', () => {
            setEvents(prev => ({ ...prev, paused: true }))
        })

        const unsubscribeResume = animationSystem.on('systemResume', () => {
            setEvents(prev => ({ ...prev, paused: false }))
        })

        return () => {
            unsubscribeStart()
            unsubscribeComplete()
            unsubscribePause()
            unsubscribeResume()
        }
    }, [animationSystem])

    const clearEvents = useCallback(() => {
        setEvents({
            started: [],
            completed: [],
            paused: false,
        })
    }, [])

    return {
        ...events,
        clearEvents,
    }
}

// Hook to check if specific shapes are animating
export function useShapeAnimationState(shapeIds: TLShapeId | TLShapeId[]) {
    const animationSystem = useAnimationSystem()
    const [isAnimating, setIsAnimating] = useState(false)
    const [animations, setAnimations] = useState<ShapeAnimation[]>([])

    useEffect(() => {
        if (!animationSystem) return

        const targetIds = Array.isArray(shapeIds) ? shapeIds : [shapeIds]

        const updateState = () => {
            const shapeAnimations = targetIds.flatMap(id =>
                animationSystem.getAnimationsForShape(id)
            )
            setAnimations(shapeAnimations)
            setIsAnimating(shapeAnimations.length > 0)
        }

        const unsubscribeStart = animationSystem.on('animationStart', updateState)
        const unsubscribeComplete = animationSystem.on('animationComplete', updateState)

        updateState() // Initial check

        return () => {
            unsubscribeStart()
            unsubscribeComplete()
        }
    }, [animationSystem, shapeIds])

    return {
        isAnimating,
        animations,
        animationCount: animations.length,
    }
} 