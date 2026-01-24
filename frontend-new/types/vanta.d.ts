declare global {
  interface Window {
    VANTA: {
      CLOUDS: (options: {
        el: HTMLElement | null
        mouseControls?: boolean
        touchControls?: boolean
        gyroControls?: boolean
        minHeight?: number
        minWidth?: number
        skyColor?: number
        cloudColor?: number
        cloudShadowColor?: number
        sunColor?: number
        sunGlareColor?: number
        sunlightColor?: number
        speed?: number
      }) => {
        destroy: () => void
      }
    }
    THREE: any
  }
}

export {}
