import Beams from './Beams';

export default function BeamsBackground({ tiltX = 0, tiltY = 0 }) {
  return (
    <div className="absolute inset-0 bg-vinto-black overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${tiltX * 5}px, ${tiltY * 5}px) scale(1.05)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <Beams
          beamWidth={1.5}
          beamHeight={15}
          beamNumber={24}
          lightColor="#E60000"
          speed={1.6}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={-45}
          gyroX={tiltX}
          gyroY={tiltY}
        />
      </div>
      <div className="absolute inset-0 vignette-overlay pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 45%, rgba(230,0,0,0.08) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
