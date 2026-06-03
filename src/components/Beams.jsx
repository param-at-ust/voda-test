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

      // Heavy blur creates the soft volumetric light-shaft look
      // beamHeight maps to blur radius
      const blurPx = beamHeight * 3.5;
      ctx.filter = `blur(${blurPx}px)`;
      ctx.globalCompositeOperation = 'screen';

      const rotRad = (rotation * Math.PI) / 180;
      const cosR = Math.cos(rotRad);
      const sinR = Math.sin(rotRad);

      // Cover a large diagonal area so beams continuously flow across
      const coverageMult = 2 + scale * 6;
      const diag = Math.sqrt(W * W + H * H);
      const totalCoverage = diag * coverageMult;
      const spacing = totalCoverage / beamNumber;

      const offsetBase = totalTimeRef.current * speed * 25;

      for (let i = 0; i < beamNumber; i++) {
        if (noiseOffsets.current[i] === undefined) {
          noiseOffsets.current[i] = Math.random() * Math.PI * 2;
        }

        const noise = noiseOffsets.current[i];
        const t = i / beamNumber;

        // Position along the diagonal axis, wrapping for continuous flow
        const rawPos = t * totalCoverage + offsetBase;
        const basePos = ((rawPos % totalCoverage) + totalCoverage) % totalCoverage - totalCoverage * 0.3;

        // Thin actual stroke width (blur makes it appear wide)
        const widthNoise = 0.6 + 0.4 * Math.sin(noise + totalTimeRef.current * speed * 0.4);
        const strokeW = Math.max(1.5, beamWidth * 2.5 * widthNoise);

        // Low alpha per beam — overlapping beams add up via screen compositing
        const alphaNoise = 0.5 + 0.5 * Math.sin(noise + totalTimeRef.current * speed * 0.2);
        const baseAlpha = (0.07 + 0.04 * alphaNoise) * (1 + scale);

        // Slight wobble perpendicular to beam direction
        const wobble = Math.sin(noise + totalTimeRef.current * speed * 1.8) * noiseIntensity * 3;

        // Perpendicular direction
        const cosP = -sinR;
        const sinP = cosR;

        // Beam center point
        const cx = W / 2 + cosR * basePos + gyroX * 6;
        const cy = H / 2 + sinR * basePos + gyroY * 6;

        // Extend far beyond viewport along rotation axis
        const extent = Math.max(W, H) * 2.5;

        // Line endpoints with perpendicular offset for wobble
        const x1 = cx + cosP * wobble - cosR * extent;
        const y1 = cy + sinP * wobble - sinR * extent;
        const x2 = cx + cosP * wobble + cosR * extent;
        const y2 = cy + sinP * wobble + sinR * extent;

        // Create gradient along the line (brighter in center, fade at ends)
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `rgba(${color.r},${color.g},${color.b},0)`);
        grad.addColorStop(0.15, `rgba(${color.r},${color.g},${color.b},${baseAlpha * 0.5})`);
        grad.addColorStop(0.5, `rgba(${color.r},${color.g},${color.b},${baseAlpha})`);
        grad.addColorStop(0.85, `rgba(${color.r},${color.g},${color.b},${baseAlpha * 0.5})`);
        grad.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = strokeW;
        ctx.strokeStyle = grad;
        ctx.lineCap = 'round';
        ctx.stroke();

        noiseOffsets.current[i] += (Math.random() - 0.5) * noiseIntensity * 0.003;
      }

      // Reset
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
