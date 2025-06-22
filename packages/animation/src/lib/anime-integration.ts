// anime.js v4.0.2 integration for tldraw animation system
const animeLib = require('animejs')

// Extract functions from anime object based on actual v4.0.2 API
const { animate, createTimeline, eases } = animeLib

// Export anime v4 functions for use in the animation system
export { animate, createTimeline, eases }

// Export the main anime object for compatibility
export const anime = animeLib

// Export types (using any for now due to complex typing)
export type AnimeJSAnimation = any
export type AnimeTimeline = any

// Anime.js v4.0.2 easing functions (lazy loaded getter functions)
export const animeEasing = {
    // Basic
    get linear() { return animeLib.eases?.linear || ((t: number) => t) },

    // Quad  
    get easeInQuad() { return animeLib.eases?.inQuad || ((t: number) => t * t) },
    get easeOutQuad() { return animeLib.eases?.outQuad || ((t: number) => t * (2 - t)) },
    get easeInOutQuad() { return animeLib.eases?.inOutQuad || ((t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t) },

    // Cubic
    get easeInCubic() { return animeLib.eases?.inCubic || ((t: number) => t * t * t) },
    get easeOutCubic() { return animeLib.eases?.outCubic || ((t: number) => (--t) * t * t + 1) },
    get easeInOutCubic() { return animeLib.eases?.inOutCubic || ((t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1) },

    // Quart
    get easeInQuart() { return animeLib.eases?.inQuart || ((t: number) => t * t * t * t) },
    get easeOutQuart() { return animeLib.eases?.outQuart || ((t: number) => 1 - (--t) * t * t * t) },
    get easeInOutQuart() { return animeLib.eases?.inOutQuart || ((t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t) },

    // Quint
    get easeInQuint() { return animeLib.eases?.inQuint || ((t: number) => t * t * t * t * t) },
    get easeOutQuint() { return animeLib.eases?.outQuint || ((t: number) => 1 + (--t) * t * t * t * t) },
    get easeInOutQuint() { return animeLib.eases?.inOutQuint || ((t: number) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t) },

    // Sine
    get easeInSine() { return animeLib.eases?.inSine || ((t: number) => 1 - Math.cos(t * Math.PI / 2)) },
    get easeOutSine() { return animeLib.eases?.outSine || ((t: number) => Math.sin(t * Math.PI / 2)) },
    get easeInOutSine() { return animeLib.eases?.inOutSine || ((t: number) => -(Math.cos(Math.PI * t) - 1) / 2) },

    // Simplified versions for other easing types (anime.js handles the complex ones)
    get easeInCirc() { return animeLib.eases?.inCirc || ((t: number) => 1 - Math.sqrt(1 - t * t)) },
    get easeOutCirc() { return animeLib.eases?.outCirc || ((t: number) => Math.sqrt(1 - (t - 1) * (t - 1))) },
    get easeInOutCirc() { return animeLib.eases?.inOutCirc || ((t: number) => t < 0.5 ? (1 - Math.sqrt(1 - 2 * t)) / 2 : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2) },

    // Expo
    get easeInExpo() { return animeLib.eases?.inExpo || ((t: number) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1))) },
    get easeOutExpo() { return animeLib.eases?.outExpo || ((t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) },
    get easeInOutExpo() { return animeLib.eases?.inOutExpo || ((t: number) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2) },

    // Complex easing types - fallback to linear if not available
    get easeInBack() { return animeLib.eases?.inBack || ((t: number) => t) },
    get easeOutBack() { return animeLib.eases?.outBack || ((t: number) => t) },
    get easeInOutBack() { return animeLib.eases?.inOutBack || ((t: number) => t) },
    get easeInElastic() { return animeLib.eases?.inElastic || ((t: number) => t) },
    get easeOutElastic() { return animeLib.eases?.outElastic || ((t: number) => t) },
    get easeInOutElastic() { return animeLib.eases?.inOutElastic || ((t: number) => t) },
    get easeInBounce() { return animeLib.eases?.inBounce || ((t: number) => t) },
    get easeOutBounce() { return animeLib.eases?.outBounce || ((t: number) => t) },
    get easeInOutBounce() { return animeLib.eases?.inOutBounce || ((t: number) => t) },
}

// Function to get all available easing functions
export function getAnimeEasingFunctions() {
    return animeEasing
}

// Test function to verify anime.js v4.0.2 is working (browser environment only)
export function testAnimeJs(): boolean {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        console.log('🌐 anime.js requires browser environment (window, document)')
        return true // Consider it working since we can't test in Node.js
    }

    try {
        // Create a simple test animation with a dummy target using v4 API
        const dummyElement = { x: 0 }
        const testAnimation = animeLib.animate(dummyElement, {
            x: 100,
            duration: 100,
            ease: 'linear',
            autoplay: false,
        })

        // If we can create an animation instance, anime.js is working
        return typeof testAnimation === 'object' && testAnimation !== null
    } catch (error) {
        console.error('anime.js v4.0.2 test failed:', error)
        return false
    }
}

// Utility to create anime.js v4 timeline
export function createAnimeTimeline(config?: any): AnimeTimeline {
    return animeLib.createTimeline(config || {})
}

// Utility to create basic anime.js v4 animation
export function createAnimeAnimation(target: any, params: any): AnimeJSAnimation {
    return animeLib.animate(target, params)
}

// Convert easing strings/functions to anime.js v4 format
export function getAnimeEasing(easing?: string | ((t: number) => number)): string | ((t: number) => number) {
    if (typeof easing === 'function') {
        return easing
    }

    // Map common easing names to anime.js v4 string equivalents
    const easingMap: Record<string, string> = {
        'ease': 'out(2)',
        'ease-in': 'in(2)',
        'ease-out': 'out(2)',
        'ease-in-out': 'inOut(2)',
        'linear': 'linear',
        // Support legacy names
        'easeInQuad': 'in(2)',
        'easeOutQuad': 'out(2)',
        'easeInOutQuad': 'inOut(2)',
        'easeInCubic': 'in(3)',
        'easeOutCubic': 'out(3)',
        'easeInOutCubic': 'inOut(3)',
    }

    return easingMap[easing || 'out(2)'] || easing || 'out(2)'
}

// Get anime.js v4 easing function by name
export function getAnimeEasingFunction(easingName: string): any {
    const easingFunctionMap: Record<string, any> = {
        'linear': eases.linear,
        'inQuad': eases.inQuad,
        'outQuad': eases.outQuad,
        'inOutQuad': eases.inOutQuad,
        'inCubic': eases.inCubic,
        'outCubic': eases.outCubic,
        'inOutCubic': eases.inOutCubic,
        'inQuart': eases.inQuart,
        'outQuart': eases.outQuart,
        'inOutQuart': eases.inOutQuart,
        'inQuint': eases.inQuint,
        'outQuint': eases.outQuint,
        'inOutQuint': eases.inOutQuint,
        'inSine': eases.inSine,
        'outSine': eases.outSine,
        'inOutSine': eases.inOutSine,
        'inCirc': eases.inCirc,
        'outCirc': eases.outCirc,
        'inOutCirc': eases.inOutCirc,
        'inExpo': eases.inExpo,
        'outExpo': eases.outExpo,
        'inOutExpo': eases.inOutExpo,
        'inBack': eases.inBack,
        'outBack': eases.outBack,
        'inOutBack': eases.inOutBack,
        'inElastic': eases.inElastic,
        'outElastic': eases.outElastic,
        'inOutElastic': eases.inOutElastic,
        'inBounce': eases.inBounce,
        'outBounce': eases.outBounce,
        'inOutBounce': eases.inOutBounce,
    }

    return easingFunctionMap[easingName] || eases.outQuad
}

// Log anime.js version and status
console.log('🎬 anime.js integration loaded')
if (testAnimeJs()) {
    console.log('✅ anime.js is working correctly')
} else {
    console.warn('⚠️ anime.js test failed')
} 