import React, { useEffect, useRef } from 'react';
import WebGLFluid from 'webgl-fluid';

export const FluidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      WebGLFluid(canvasRef.current, {
        TRIGGER: 'hover',
        IMMEDIATE: false,
        AUTO: false,
        INTERVAL: 3000,
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1.5,
        VELOCITY_DISSIPATION: 0.2,
        PRESSURE: 0.1,
        PRESSURE_ITERATIONS: 20,
        CURL: 3,
        SPLAT_RADIUS: 0.2,
        SPLAT_FORCE: 6000,
        SPLAT_COUNT: 0,
        SPLAT_COLOR: { r: 0, g: 0, b: 0 },
        SHADING: true,
        COLORFUL: false,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: { r: 227, g: 227, b: 213 }, // #E3E3D5 in RGB
        TRANSPARENT: false,
        BLOOM: false,
        SUNRAYS: false,
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
};
