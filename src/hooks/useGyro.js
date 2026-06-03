import { useState, useEffect, useRef, useCallback } from 'react';

export function useGyro(options = {}) {
  const { maxOffset = 8, maxAngle = 3, smoothFactor = 0.08 } = options;
  const [state, setState] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const handleOrientationRef = useRef(null);

  const animate = useCallback(() => {
    const tx = targetRef.current.x;
    const ty = targetRef.current.y;
    const sf = smoothFactor;

    currentRef.current.x += (tx - currentRef.current.x) * sf;
    currentRef.current.y += (ty - currentRef.current.y) * sf;

    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, currentRef.current.x));
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, currentRef.current.y));

    setState({
      x: (clampedX / maxOffset) * maxAngle,
      y: (clampedY / maxOffset) * maxAngle,
    });

    rafRef.current = requestAnimationFrame(animate);
  }, [maxOffset, maxAngle, smoothFactor]);

  useEffect(() => {
    handleOrientationRef.current = (event) => {
      const gamma = event.gamma || 0;
      const beta = event.beta || 0;
      targetRef.current.x = Math.max(-1, Math.min(1, gamma / 45)) * maxOffset;
      targetRef.current.y = Math.max(-1, Math.min(1, (beta - 45) / 45)) * maxOffset;
    };

    const handleMouse = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      targetRef.current.x = x * maxOffset;
      targetRef.current.y = y * maxOffset;
    };

    const setupOrientation = () => {
      window.addEventListener('deviceorientation', handleOrientationRef.current);
    };

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((permission) => {
          if (permission === 'granted') setupOrientation();
        })
        .catch(() => {});
    } else if ('DeviceOrientationEvent' in window) {
      setupOrientation();
    }

    window.addEventListener('mousemove', handleMouse, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouse);
      if (handleOrientationRef.current) {
        window.removeEventListener('deviceorientation', handleOrientationRef.current);
      }
    };
  }, [maxOffset, animate]);

  return { tiltX: state.x, tiltY: state.y };
}
