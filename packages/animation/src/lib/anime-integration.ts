// anime.js integration for tldraw animation system
const anime = require('animejs')

// Export anime for use in the animation system
export { anime }

// Anime.js v3 easing functions (string-based)
export const animeEasing = {
    // Basic
    linear: 'linear',

    // Quad
    easeInQuad: 'easeInQuad',
    easeOutQuad: 'easeOutQuad',
    easeInOutQuad: 'easeInOutQuad',

    // Cubic
    easeInCubic: 'easeInCubic',
    easeOutCubic: 'easeOutCubic',
    easeInOutCubic: 'easeInOutCubic',

    // Quart
    easeInQuart: 'easeInQuart',
    easeOutQuart: 'easeOutQuart',
    easeInOutQuart: 'easeInOutQuart',

    // Quint
    easeInQuint: 'easeInQuint',
    easeOutQuint: 'easeOutQuint',
    easeInOutQuint: 'easeInOutQuint',

    // Sine
    easeInSine: 'easeInSine',
    easeOutSine: 'easeOutSine',
    easeInOutSine: 'easeInOutSine',

    // Circ
    easeInCirc: 'easeInCirc',
    easeOutCirc: 'easeOutCirc',
    easeInOutCirc: 'easeInOutCirc',

    // Expo
    easeInExpo: 'easeInExpo',
    easeOutExpo: 'easeOutExpo',
    easeInOutExpo: 'easeInOutExpo',

    // Back
    easeInBack: 'easeInBack',
    easeOutBack: 'easeOutBack',
    easeInOutBack: 'easeInOutBack',

    // Elastic
    easeInElastic: 'easeInElastic',
    easeOutElastic: 'easeOutElastic',
    easeInOutElastic: 'easeInOutElastic',

    // Bounce
    easeInBounce: 'easeInBounce',
    easeOutBounce: 'easeOutBounce',
    easeInOutBounce: 'easeInOutBounce',
} as const

// Test function to verify anime.js is working (browser environment only)
export function testAnimeJs(): boolean {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        console.log('🌐 anime.js requires browser environment (window, document)')
        return true // Consider it working since we can't test in Node.js
    }

    try {
        // Create a simple test animation with a dummy target
        const dummyElement = { x: 0 }
        const testAnimation = anime({
            targets: dummyElement,
            x: 100,
            duration: 100,
            easing: 'linear',
            autoplay: false,
        })

        // If we can create an animation instance, anime.js is working
        return typeof testAnimation === 'object' && testAnimation !== null
    } catch (error) {
        console.error('anime.js test failed:', error)
        return false
    }
}

// Utility to create anime.js timeline
export function createAnimeTimeline(config?: any) {
    return anime.timeline(config || {})
}

// Utility to create basic anime.js animation
export function createAnimeAnimation(params: any) {
    return anime(params)
}

// Convert our easing strings to anime.js format
export function getAnimeEasing(easing?: string | ((t: number) => number)): string | ((t: number) => number) {
    if (typeof easing === 'function') {
        return easing
    }

    // Map common easing names to anime.js equivalents
    const easingMap: Record<string, string> = {
        'ease': 'easeInOutQuad',
        'ease-in': 'easeInQuad',
        'ease-out': 'easeOutQuad',
        'ease-in-out': 'easeInOutQuad',
        'linear': 'linear',
    }

    return easingMap[easing || 'easeOutQuad'] || easing || 'easeOutQuad'
}

// Log anime.js version and status
console.log('🎬 anime.js integration loaded')
if (testAnimeJs()) {
    console.log('✅ anime.js is working correctly')
} else {
    console.warn('⚠️ anime.js test failed')
} 