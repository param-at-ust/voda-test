import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGyro } from './hooks/useGyro';
import BeamsBackground from './components/BeamsBackground';
import HeroSection from './components/HeroSection';
import AIChatPlaceholder from './components/AIChatPlaceholder';
import DomainPills from './components/DomainPills';
import SplashScreen from './components/onboarding/SplashScreen';
import MobileEntry from './components/onboarding/MobileEntry';
import OTPEntry from './components/onboarding/OTPEntry';

// Onboarding flow steps
// 'splash' — branded splash with Sign Up CTA
// 'mobile' — mobile number entry with geo country code
// 'otp'    — 6-digit verification (mock: 123456)
// 'home'   — main app / marketing page

export default function App() {
  const { tiltX, tiltY } = useGyro({ maxOffset: 8, maxAngle: 3, smoothFactor: 0.08 });
  const [step, setStep] = useState('splash');
  const [phoneData, setPhoneData] = useState(null); // { country, phone }

  return (
    <div className="relative w-full h-full">
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
              onContinue={(data) => {
                setPhoneData(data);
                setStep('otp');
              }}
            />
          </div>
        )}

        {step === 'otp' && (
          <div key="otp" className="absolute inset-0 flex flex-col">
            <OTPEntry
              country={phoneData?.country}
              phone={phoneData?.phone}
              onBack={() => setStep('mobile')}
              onVerified={() => setStep('home')}
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
