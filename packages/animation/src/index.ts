// Main entry point for @tldraw/animation package
export * from './lib/animations'
export * from './lib/effects'
export * from './lib/transitions'
export * from './lib/utils'
export * from './lib/types'

// Main animation system class
export { AnimationSystem } from './lib/AnimationSystem'

// Hooks for React integration
export { useShapeAnimation } from './lib/hooks'

// Anime.js integration
export * from './lib/anime-integration'

// Version
export const version = '3.13.0' 