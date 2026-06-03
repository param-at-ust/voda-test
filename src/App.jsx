import { useGyro } from './hooks/useGyro';
import BeamsBackground from './components/BeamsBackground';
import HeroSection from './components/HeroSection';
import DataWidget from './components/DataWidget';
import AIChatPlaceholder from './components/AIChatPlaceholder';
import DomainPills from './components/DomainPills';

export default function App() {
  const { tiltX, tiltY } = useGyro({ maxOffset: 8, maxAngle: 3, smoothFactor: 0.08 });

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-between"
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 24px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 20px)',
      }}
    >
      <BeamsBackground tiltX={tiltX} tiltY={tiltY} />

      <div className="flex flex-col items-center w-full pt-6">
        <HeroSection />
      </div>

      <DataWidget />

      <div className="w-full flex flex-col items-center">
        <AIChatPlaceholder />
        <DomainPills />
      </div>
    </div>
  );
}
