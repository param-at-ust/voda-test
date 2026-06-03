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

      const rotRad = (rotation * Math.PI) / 180;
      const cosR = Math.cos(rotRad);
      const sinR = Math.sin(rotRad);

      // Perpendicular direction
      const cosP = -sinR;
      const sinP = cosR;

      const diag = Math.sqrt(W * W + H * H);

      // === LAYER 1: Background faint beams ===
      {
        const count = Math.floor(beamNumber * 0.6); // 14 background beams
        const coverage = diag * (0.8 + scale * 2); // Tight coverage
        const blurPx = beamHeight * 0.9; // ~13px blur

        ctx.filter = `blur(${blurPx}px)`;
        ctx.globalCompositeOperation = 'source-over';

        const drift = totalTimeRef.current * speed * 12;

        for (let i = 0; i < count; i++) {
          if (noiseOffsets.current[i] === undefined) {
            noiseOffsets.current[i] = Math.random() * Math.PI * 2;
          }
          const noise = noiseOffsets.current[i];

          const rawPos = (i / count) * coverage + drift;
          const pos = rawPos % coverage;

          // Width: 8-18px (narrow)
          const wMod = 0.5 + 0.5 * Math.sin(noise + totalTimeRef.current * speed * 0.3);
          const shaftW = Math.max(8, beamWidth * 10 * wMod);

          // Alpha: very subtle 0.03-0.06
          const aMod = 0.5 + 0.5 * Math.sin(noise + totalTimeRef.current * speed * 0.2);
          const alpha = 0.03 + 0.03 * aMod;

          const wobble = Math.sin(noise + totalTimeRef.current * speed) * noiseIntensity * 3;

          const cx = W / 2 + cosR * (pos - coverage * 0.3) + gyroX * 4;
          const cy = H / 2 + sinR * (pos - coverage * 0.3) + gyroY * 4;

          const extent = Math.max(W, H) * 2;
          const hw = shaftW / 2;
          const wx = cosP * (hw + wobble);
          const wy = sinP * (hw + wobble);

          const fcx = cx + cosR * extent;
          const fcy = cy + sinR * extent;
          const bcx = cx - cosR * extent;
          const bcy = cy - sinR * extent;

          const grad = ctx.createLinearGradient(
            cx + cosP * hw, cy + sinP * hw,
            cx - cosP * hw, cy - sinP * hw
          );
          grad.addColorStop(0, `rgba(${color.r},${color.g},${color.b},0)`);
          grad.addColorStop(0.3, `rgba(${color.r},${color.g},${color.b},${alpha * 0.5})`);
          grad.addColorStop(0.5, `rgba(${color.r},${color.g},${color.b},${alpha})`);
          grad.addColorStop(0.7, `rgba(${color.r},${color.g},${color.b},${alpha * 0.5})`);
          grad.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(bcx + wx, bcy + wy);
          ctx.lineTo(fcx + wx, fcy + wy);
          ctx.lineTo(fcx - wx, fcy - wy);
          ctx.lineTo(bcx - wx, bcy - wy);
          ctx.closePath();
          ctx.fill();

          noiseOffsets.current[i] += (Math.random() - 0.5) * noiseIntensity * 0.003;
        }
      }

      // === LAYER 2: Foreground brighter beams ===
      {
        const count = Math.floor(beamNumber * 0.5); // 12 foreground beams
        const coverage = diag * (0.7 + scale * 2);
        const blurPx = beamHeight * 0.7; // ~10px blur

        ctx.filter = `blur(${blurPx}px)`;
        ctx.globalCompositeOperation = 'lighter';

        const drift = totalTimeRef.current * speed * 18;
        const offset = coverage * 0.5; // Offset from background layer

        for (let i = 0; i < count; i++) {
          const idx = 100 + i; // Separate noise index
          if (noiseOffsets.current[idx] === undefined) {
            noiseOffsets.current[idx] = Math.random() * Math.PI * 2;
          }
          const noise = noiseOffsets.current[idx];

          const rawPos = (i / count) * coverage + drift + offset;
          const pos = rawPos % coverage;

          // Width: 12-28px (medium)
          const wMod = 0.5 + 0.5 * Math.sin(noise + totalTimeRef.current * speed * 0.4);
          const shaftW = Math.max(12, beamWidth * 16 * wMod);

          // Alpha: 0.06-0.12 (visible but not overwhelming)
          const aMod = 0.5 + 0.5 * Math.sin(noise + totalTimeRef.current * speed * 0.25);
          const alpha = 0.06 + 0.06 * aMod;

          const wobble = Math.sin(noise + totalTimeRef.current * speed * 1.3) * noiseIntensity * 4;

          const cx = W / 2 + cosR * (pos - coverage * 0.2) + gyroX * 6;
          const cy = H / 2 + sinR * (pos - coverage * 0.2) + gyroY * 6;

          const extent = Math.max(W, H) * 2;
          const hw = shaftW / 2;
          const wx = cosP * (hw + wobble);
          const wy = sinP * (hw + wobble);

          const fcx = cx + cosR * extent;
          const fcy = cy + sinR * extent;
          const bcx = cx - cosR * extent;
          const bcy = cy - sinR * extent;

          const grad = ctx.createLinearGradient(
            cx + cosP * hw, cy + sinP * hw,
            cx - cosP * hw, cy - sinP * hw
          );
          grad.addColorStop(0, `rgba(${color.r},${color.g},${color.b},0)`);
          grad.addColorStop(0.25, `rgba(${color.r},${color.g},${color.b},${alpha * 0.5})`);
          grad.addColorStop(0.5, `rgba(${color.r},${color.g},${color.b},${alpha})`);
          grad.addColorStop(0.75, `rgba(${color.r},${color.g},${color.b},${alpha * 0.5})`);
          grad.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(bcx + wx, bcy + wy);
          ctx.lineTo(fcx + wx, fcy + wy);
          ctx.lineTo(fcx - wx, fcy - wy);
          ctx.lineTo(bcx - wx, bcy - wy);
          ctx.closePath();
          ctx.fill();

          noiseOffsets.current[idx] += (Math.random() - 0.5) * noiseIntensity * 0.004;
        }
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
