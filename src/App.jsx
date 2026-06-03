import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGyro } from './hooks/useGyro';
import BeamsBackground from './components/BeamsBackground';
import HeroSection from './components/HeroSection';
import AIChatPlaceholder from './components/AIChatPlaceholder';
import DomainPills from './components/DomainPills';
import SplashScreen from './components/onboarding/SplashScreen';
import MobileEntry from './components/onboarding/MobileEntry';

// Onboarding flow steps
// 'home'   — original marketing page (pre-onboarding)
// 'splash' — splash screen with Sign Up CTA
// 'mobile' — mobile number entry

export default function App() {
  const { tiltX, tiltY } = useGyro({ maxOffset: 8, maxAngle: 3, smoothFactor: 0.08 });
  const [step, setStep] = useState('splash');

  return (
    <div className="relative w-full h-full">
      {/* Animated background is always present */}
      <BeamsBackground tiltX={tiltX} tiltY={tiltY} />

      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <div key="splash" className="absolute inset-0 flex flex-col items-center justify-between">
            <SplashScreen onSignUp={() => setStep('mobile')} />
          </div>
        )}

        {step === 'mobile' && (
          <div key="mobile" className="absolute inset-0 flex flex-col">
            <MobileEntry
              onBack={() => setStep('splash')}
              onContinue={({ country, phone }) => {
                // TODO: send OTP — pass to next onboarding step
                console.log('Continue with', country.dial, phone);
              }}
            />
          </div>
        )}

        {step === 'home' && (
          <div
            key="home"
            className="absolute inset-0 flex flex-col items-center justify-between"
            style={{
              paddingTop: 'max(env(safe-area-inset-top), 24px)',
              paddingBottom: 'max(env(safe-area-inset-bottom), 20px)',
            }}
          >
            <div className="flex-1 flex items-center justify-center w-full">
              <HeroSection />
            </div>
            <div className="w-full flex flex-col items-center">
              <AIChatPlaceholder />
              <DomainPills />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
