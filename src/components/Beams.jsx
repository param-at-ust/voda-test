import { useEffect, useRef } from 'react';

const Beams = ({
  beamWidth = 1.5,
  beamHeight = 15,
  beamNumber = 24,
  lightColor = '#E60000',
  speed = 1.6,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = -45,
  gyroX = 0,
  gyroY = 0,
}) => {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const timeRef = useRef(0);
  const beamsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const color = parseColor(lightColor);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    window.addEventListener('resize', resize);
    resize();

    // Initialize beams with randomized properties
    const initBeams = () => {
      beamsRef.current = [];
      for (let i = 0; i < beamNumber; i++) {
        beamsRef.current.push({
          noiseOffset: Math.random() * Math.PI * 2,
          baseWidth: 8 + Math.random() * 20,
          baseAlpha: 0.04 + Math.random() * 0.08,
          speedMult: 0.7 + Math.random() * 0.6,
        });
      }
    };
    initBeams();

    let lastTime = 0;

    const animate = (timestamp) => {
      const dt = lastTime ? (timestamp - lastTime) / 1000 : 0.016;
      lastTime = timestamp;
      timeRef.current += dt;

      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const rotRad = (rotation * Math.PI) / 180;
      const cosR = Math.cos(rotRad);
      const sinR = Math.sin(rotRad);

      // Blur amount based on beamHeight prop
      const blurPx = beamHeight * 1.5;
      ctx.filter = `blur(${blurPx}px)`;

      // Draw each beam
      for (let i = 0; i < beamNumber; i++) {
        const beam = beamsRef.current[i];
        const noise = beam.noiseOffset;

        // Position: distribute evenly with animated drift
        const cycleDuration = (beamNumber * 0.5) / (speed * beam.speedMult);
        const progress = (timeRef.current / cycleDuration + i / beamNumber) % 1;

        // Position along perpendicular axis (across the viewport)
        // We want beams spaced across the viewport width
        const spacing = W / 4; // 4 beams visible across width
        const pos = progress * spacing * beamNumber - spacing;

        // Apply noise to position for organic feel
        const posNoise = Math.sin(noise + timeRef.current * speed * 0.5) * noiseIntensity * 5;
        const finalPos = pos + posNoise;

        // Width modulation
        const widthNoise = 0.6 + 0.4 * Math.sin(noise + timeRef.current * speed * 0.3);
        const width = beam.baseWidth * widthNoise * (1 + scale);

        // Alpha modulation
        const alphaNoise = 0.5 + 0.5 * Math.sin(noise + timeRef.current * speed * 0.2);
        const alpha = beam.baseAlpha * alphaNoise;

        // Calculate beam geometry
        // Start point (offset perpendicular to rotation)
        const cosP = -sinR;
        const sinP = cosR;

        const cx = W / 2 + cosP * finalPos + gyroX * 3;
        const cy = H / 2 + sinP * finalPos + gyroY * 3;

        // Extend far in both directions along rotation axis
        const extent = Math.max(W, H) * 2;

        // Draw as thick line with gradient
        const grad = ctx.createLinearGradient(
          cx - cosP * width, cy - sinP * width,
          cx + cosP * width, cy + sinP * width
        );
        grad.addColorStop(0, `rgba(${color.r},${color.g},${color.b},0)`);
        grad.addColorStop(0.3, `rgba(${color.r},${color.g},${color.b},${alpha * 0.5})`);
        grad.addColorStop(0.5, `rgba(${color.r},${color.g},${color.b},${alpha})`);
        grad.addColorStop(0.7, `rgba(${color.r},${color.g},${color.b},${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);

        ctx.beginPath();
        ctx.moveTo(cx - cosR * extent - cosP * width, cy - sinR * extent - sinP * width);
        ctx.lineTo(cx + cosR * extent - cosP * width, cy + sinR * extent - sinP * width);
        ctx.lineTo(cx + cosR * extent + cosP * width, cy + sinR * extent + sinP * width);
        ctx.lineTo(cx - cosR * extent + cosP * width, cy - sinR * extent + sinP * width);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        beam.noiseOffset += (Math.random() - 0.5) * noiseIntensity * 0.002;
      }

      ctx.filter = 'none';
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [beamWidth, beamHeight, beamNumber, lightColor, speed, noiseIntensity, scale, rotation, gyroX, gyroY]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};

function parseColor(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

export default Beams;
