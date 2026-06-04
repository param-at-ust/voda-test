import { useMemo } from 'react';

export default function Beams({
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
}) {
  const blurAmount = beamHeight * 1.2;

  // Pre-compute beam data so it's stable across renders
  const beams = useMemo(() => {
    return Array.from({ length: beamNumber }, (_, i) => {
      const t = i / beamNumber;
      const spacing = 100 / beamNumber;
      const basePos = (t - 0.5) * 100;
      const width = 8 + Math.random() * 20;
      const alpha = 0.05 + Math.random() * 0.08;
      const animDelay = Math.random() * -4;
      const animDuration = 3 + Math.random() * 2;

      // Convert alpha to hex for gradient
      const alphaHex = Math.floor(alpha * 255)
        .toString(16)
        .padStart(2, '0');

      return {
        id: i,
        basePos,
        width: width * (1 + scale * 2),
        gradient: `linear-gradient(90deg, transparent 0%, transparent 20%, ${lightColor}${alphaHex} 50%, transparent 80%, transparent 100%)`,
        animDelay,
        animDuration,
      };
    });
  }, [beamNumber, lightColor, scale]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {beams.map((beam) => (
        <div
          key={beam.id}
          className="absolute animate-beam-pulse"
          style={{
            left: '50%',
            top: '50%',
            width: '300vw',
            height: `${beam.width}px`,
            transform: `
              translate(-50%, -50%)
              rotate(${rotation}deg)
              translateY(${beam.basePos}vh)
              translateX(${gyroX * 4}px)
              translateY(${gyroY * 4}px)
            `,
            background: beam.gradient,
            filter: `blur(${blurAmount}px)`,
            animationDelay: `${beam.animDelay}s`,
            animationDuration: `${beam.animDuration}s`,
          }}
        />
      ))}
    </div>
  );
}
