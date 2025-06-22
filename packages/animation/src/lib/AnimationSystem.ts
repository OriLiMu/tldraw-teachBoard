import type { Editor } from '@tldraw/editor'
import type { TLShapeId, TLShape } from '@tldraw/tlschema'
import type { ShapeAnimation, AnimationGroup, AnimationConfig } from './types'
import { normalizeShapeIds, generateAnimationId, validateAnimationProps } from './utils'

// Animation system events
export interface AnimationSystemEvents {
    animationStart: (animation: ShapeAnimation) => void
    animationUpdate: (animation: ShapeAnimation, progress: number) => void
    animationComplete: (animation: ShapeAnimation) => void
    animationPause: (animation: ShapeAnimation) => void
    animationResume: (animation: ShapeAnimation) => void
    systemPause: () => void
    systemResume: () => void
}

// Main animation system class
export class AnimationSystem {
    private editor: Editor
    private activeAnimations = new Map<string, ShapeAnimation>()
    private animationGroups = new Map<string, AnimationGroup>()
    private isRunning = true
    private eventListeners = new Map<keyof AnimationSystemEvents, Array<Function>>()
    private rafId: number | null = null
    private currentTime = 0

    constructor(editor: Editor) {
        this.editor = editor
        this.startAnimationLoop()
        console.log('🎬 Animation system initialized')
    }

    // Event system
    on<T extends keyof AnimationSystemEvents>(
        event: T,
        callback: AnimationSystemEvents[T]
    ): () => void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, [])
        }
        this.eventListeners.get(event)!.push(callback)

        // Return unsubscribe function
        return () => {
            const listeners = this.eventListeners.get(event)
            if (listeners) {
                const index = listeners.indexOf(callback)
                if (index > -1) {
                    listeners.splice(index, 1)
                }
            }
        }
    }

    private emit<T extends keyof AnimationSystemEvents>(
        event: T,
        ...args: Parameters<AnimationSystemEvents[T]>
    ): void {
        const listeners = this.eventListeners.get(event)
        if (listeners) {
            listeners.forEach(callback => callback(...args))
        }
    }

    // Start a single animation
    animate(animation: ShapeAnimation): string {
        // Validate animation
        if (!validateAnimationProps(animation.properties)) {
            console.warn('Invalid animation properties:', animation.properties)
            return ''
        }

        // Ensure animation has an ID
        if (!animation.id) {
            animation.id = generateAnimationId()
        }

        // Add to active animations
        this.activeAnimations.set(animation.id, {
            ...animation,
            startTime: this.currentTime + (animation.delay || 0),
        })

        console.log(`🎬 Starting animation ${animation.id} for shape(s):`, animation.target)
        this.emit('animationStart', animation)

        return animation.id
    }

    // Start multiple animations as a group
    animateGroup(group: AnimationGroup): string {
        if (!group.id) {
            group.id = generateAnimationId()
        }

        // Start all animations in the group
        group.animations.forEach(animation => {
            this.animate({
                ...animation,
                ...group.config, // Apply group config as defaults
            })
        })

        this.animationGroups.set(group.id, group)
        console.log(`🎬 Starting animation group ${group.id} with ${group.animations.length} animations`)

        return group.id
    }

    // Stop a specific animation
    stop(animationId: string): boolean {
        const animation = this.activeAnimations.get(animationId)
        if (animation) {
            this.activeAnimations.delete(animationId)
            console.log(`⏹️ Stopped animation ${animationId}`)
            return true
        }
        return false
    }

    // Stop all animations for specific shape(s)
    stopForShapes(shapeIds: TLShapeId | TLShapeId[]): void {
        const targetIds = normalizeShapeIds(shapeIds)
        const toStop: string[] = []

        this.activeAnimations.forEach((animation, id) => {
            const animationTargets = normalizeShapeIds(animation.target)
            if (animationTargets.some(targetId => targetIds.includes(targetId))) {
                toStop.push(id)
            }
        })

        toStop.forEach(id => this.stop(id))
        console.log(`⏹️ Stopped ${toStop.length} animations for shapes:`, targetIds)
    }

    // Stop all animations
    stopAll(): void {
        const count = this.activeAnimations.size
        this.activeAnimations.clear()
        this.animationGroups.clear()
        console.log(`⏹️ Stopped all ${count} animations`)
    }

    // Pause/resume system
    pause(): void {
        this.isRunning = false
        this.emit('systemPause')
        console.log('⏸️ Animation system paused')
    }

    resume(): void {
        this.isRunning = true
        this.emit('systemResume')
        console.log('▶️ Animation system resumed')
    }

    // Pause specific animation
    pauseAnimation(animationId: string): boolean {
        const animation = this.activeAnimations.get(animationId)
        if (animation) {
            // Mark as paused (implementation would need to track pause state)
            this.emit('animationPause', animation)
            return true
        }
        return false
    }

    // Get current animations
    getActiveAnimations(): ShapeAnimation[] {
        return Array.from(this.activeAnimations.values())
    }

    getAnimationsForShape(shapeId: TLShapeId): ShapeAnimation[] {
        return this.getActiveAnimations().filter(animation => {
            const targets = normalizeShapeIds(animation.target)
            return targets.includes(shapeId)
        })
    }

    // Animation loop
    private startAnimationLoop(): void {
        const animate = (timestamp: number) => {
            this.currentTime = timestamp

            if (this.isRunning) {
                this.updateAnimations(timestamp)
            }

            this.rafId = requestAnimationFrame(animate)
        }

        this.rafId = requestAnimationFrame(animate)
    }

    // Update all active animations
    private updateAnimations(timestamp: number): void {
        const completedAnimations: string[] = []

        this.activeAnimations.forEach((animation, id) => {
            if (timestamp < animation.startTime!) {
                return // Animation hasn't started yet
            }

            const elapsed = timestamp - animation.startTime!
            const duration = animation.duration || 1000
            const progress = Math.min(elapsed / duration, 1)

            // Update shape properties
            this.updateShapeProperties(animation, progress)

            // Emit update event
            this.emit('animationUpdate', animation, progress)

            // Check if animation is complete
            if (progress >= 1) {
                completedAnimations.push(id)
                this.emit('animationComplete', animation)
            }
        })

        // Remove completed animations
        completedAnimations.forEach(id => {
            this.activeAnimations.delete(id)
        })
    }

    // Update shape properties based on animation progress
    private updateShapeProperties(animation: ShapeAnimation, progress: number): void {
        const shapeIds = normalizeShapeIds(animation.target)

        shapeIds.forEach(shapeId => {
            const shape = this.editor.getShape(shapeId)
            if (!shape) return

            const updates: Partial<TLShape> = {}

            // Apply property updates based on animation progress
            Object.entries(animation.properties).forEach(([prop, targetValue]) => {
                if (prop === 'scale' && typeof targetValue === 'object') {
                    // Handle scale specially (would need more complex implementation)
                    // This is a simplified version
                    updates.x = shape.x * targetValue.x * progress
                    updates.y = shape.y * targetValue.y * progress
                } else if (typeof targetValue === 'number') {
                    // Interpolate numeric values
                    const currentValue = (shape as any)[prop] || 0
                    const interpolatedValue = currentValue + (targetValue - currentValue) * progress;
                    (updates as any)[prop] = interpolatedValue
                }
            })

            // Apply updates to shape
            if (Object.keys(updates).length > 0) {
                this.editor.updateShape({ id: shapeId, type: shape.type, ...updates })
            }
        })
    }

    // Cleanup
    destroy(): void {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId)
        }
        this.stopAll()
        this.eventListeners.clear()
        console.log('🗑️ Animation system destroyed')
    }

    // Utility methods
    isAnimating(shapeId?: TLShapeId): boolean {
        if (!shapeId) {
            return this.activeAnimations.size > 0
        }
        return this.getAnimationsForShape(shapeId).length > 0
    }

    getAnimationCount(): number {
        return this.activeAnimations.size
    }
} 