/// <reference types="vite/client" />

// Allow importing image files
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}

// Minimal Google Maps / StreetViewPanorama type stubs
// (Full types: npm install @types/google.maps)
declare namespace google {
  namespace maps {
    class StreetViewPanorama {
      constructor(
        element: HTMLElement,
        options: {
          position: { lat: number; lng: number };
          pov: { heading: number; pitch: number };
          zoom: number;
          addressControl: boolean;
          showRoadLabels: boolean;
          motionTracking: boolean;
          motionTrackingControl: boolean;
        }
      );
      setPosition(position: { lat: number; lng: number }): void;
      setPov(pov: { heading: number; pitch: number }): void;
    }
  }
}
