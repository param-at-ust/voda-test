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
  const totalTimeRef = useRef(0);
  const noiseOffsets = useRef([]);
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const color = parseColor(lightColor);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      dimsRef.current = {
        w: rect.width * dpr,
        h: rect.height * dpr,
        dpr,
      };
      canvas.width = dimsRef.current.w;
      canvas.height = dimsRef.current.h;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    window.addEventListener('resize', resize);
    resize();

    let lastTime = 0;

    const animate = (timestamp) => {
      const dt = lastTime ? (timestamp - lastTime) / 1000 : 0.016;
      lastTime = timestamp;
      totalTimeRef.current += dt;

      const { w, h, dpr } = dimsRef.current;
      const W = w / dpr;
      const H = h / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Moderate blur — softens edges but preserves shaft body
      const blurPx = beamHeight * 1.2;
      ctx.filter = `blur(${blurPx}px)`;
      ctx.globalCompositeOperation = 'lighter';

      const rotRad = (rotation * Math.PI) / 180;
      const cosR = Math.cos(rotRad);
      const sinR = Math.sin(rotRad);

      // Perpendicular direction
      const cosP = -sinR;
      const sinP = cosR;

      // Coverage: tighter so more beams are visible at once
      const diag = Math.sqrt(W * W + H * H);
      const coverageMult = 1.2 + scale * 3;
      const totalCoverage = diag * coverageMult;

      // Animated drift along the diagonal
      const driftSpeed = speed * 18;
      const offsetBase = totalTimeRef.current * driftSpeed;

      for (let i = 0; i < beamNumber; i++) {
        if (noiseOffsets.current[i] === undefined) {
          noiseOffsets.current[i] = Math.random() * Math.PI * 2;
        }

        const noise = noiseOffsets.current[i];
        const t = i / beamNumber;

        // Position along diagonal, wrapping for infinite loop
        const rawPos = t * totalCoverage + offsetBase;
        const wrappedPos = rawPos % totalCoverage;
        const basePos = wrappedPos - totalCoverage * 0.15;

        // Broad shaft width (actual geometry, not just stroke width)
        const widthNoise = 0.5 + 0.5 * Math.sin(noise + totalTimeRef.current * speed * 0.35);
        const shaftWidth = Math.max(24, beamWidth * 28 * widthNoise);

        // Alpha: clearly visible but not overwhelming
        const alphaNoise = 0.5 + 0.5 * Math.sin(noise + totalTimeRef.current * speed * 0.25);
        const alpha = 0.18 + 0.12 * alphaNoise;

        // Perpendicular wobble
        const wobble = Math.sin(noise + totalTimeRef.current * speed * 1.5) * noiseIntensity * 5;

        // Center of the shaft
        const cx = W / 2 + cosR * basePos + gyroX * 5;
        const cy = H / 2 + sinR * basePos + gyroY * 5;

        // Extend far beyond viewport
        const extent = Math.max(W, H) * 2;

        // Four corners of the shaft quad
        const hw = shaftWidth / 2;
        const wx = cosP * (hw + wobble);
        const wy = sinP * (hw + wobble);

        // Front edge
        const fcx = cx + cosR * extent;
        const fcy = cy + sinR * extent;
        // Back edge
        const bcx = cx - cosR * extent;
        const bcy = cy - sinR * extent;

        // Perpendicular gradient: bright center → transparent edges
        const grad = ctx.createLinearGradient(
          cx + cosP * hw, cy + sinP * hw,
          cx - cosP * hw, cy - sinP * hw
        );
        grad.addColorStop(0, `rgba(${color.r},${color.g},${color.b},0)`);
        grad.addColorStop(0.25, `rgba(${color.r},${color.g},${color.b},${alpha * 0.4})`);
        grad.addColorStop(0.5, `rgba(${color.r},${color.g},${color.b},${alpha})`);
        grad.addColorStop(0.75, `rgba(${color.r},${color.g},${color.b},${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(bcx + wx, bcy + wy);
        ctx.lineTo(fcx + wx, fcy + wy);
        ctx.lineTo(fcx - wx, fcy - wy);
        ctx.lineTo(bcx - wx, bcy - wy);
        ctx.closePath();
        ctx.fill();

        noiseOffsets.current[i] += (Math.random() - 0.5) * noiseIntensity * 0.004;
      }

      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'source-over';

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
