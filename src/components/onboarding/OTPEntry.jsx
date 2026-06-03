import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_OTP = '123456';
const LENGTH = 6;

export default function OTPEntry({ country, phone, onBack, onVerified }) {
  const [digits, setDigits] = useState(Array(LENGTH).fill(''));
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (i, val) => {
    const char = val.replace(/\D/g, '').slice(-1);
    if (!char) return;

    setError(false);
    const next = [...digits];
    next[i] = char;
    setDigits(next);

    if (i < LENGTH - 1) inputsRef.current[i + 1]?.focus();

    // Auto-verify when last digit entered
    if (i === LENGTH - 1) verify(next.join(''));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = [...digits];
        next[i] = '';
        setDigits(next);
        setError(false);
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
      }
    }
  };

  // Allow paste across all cells
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (!pasted) return;
    const next = Array(LENGTH).fill('');
    pasted.split('').forEach((ch, idx) => { next[idx] = ch; });
    setDigits(next);
    setError(false);
    const focusIdx = Math.min(pasted.length, LENGTH - 1);
    inputsRef.current[focusIdx]?.focus();
    if (pasted.length === LENGTH) verify(pasted);
  };

  const verify = (code) => {
    setVerifying(true);
    // Simulate network delay
    setTimeout(() => {
      setVerifying(false);
      if (code === MOCK_OTP) {
        onVerified();
      } else {
        setError(true);
        setShake(true);
        setDigits(Array(LENGTH).fill(''));
        setTimeout(() => {
          setShake(false);
          inputsRef.current[0]?.focus();
        }, 500);
      }
    }, 700);
  };

  const maskedNumber = `${country?.dial ?? ''} ••••• ${phone?.slice(-3) ?? ''}`;

  return (
    <motion.div
      className="relative z-10 flex flex-col w-full h-full"
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 56px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 36px)',
      }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Back */}
      <div className="px-5 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A29191" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#A29191' }}>Back</span>
        </button>
      </div>

      {/* Heading */}
      <div className="px-6 mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(30px, 7vw, 40px)',
            color: '#FFFFFF',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          Enter your<br />
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>
            verification code
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            color: '#666666',
            marginTop: '10px',
            lineHeight: 1.5,
          }}
        >
          Code sent to{' '}
          <span style={{ color: '#A29191' }}>{maskedNumber}</span>
        </motion.p>
      </div>

      {/* OTP boxes */}
      <motion.div
        className="px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.3 }}
      >
        <motion.div
          className="flex gap-3 justify-center"
          animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.45 }}
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              style={{
                width: 'clamp(42px, 12vw, 52px)',
                height: 'clamp(52px, 14vw, 64px)',
                textAlign: 'center',
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(22px, 5vw, 28px)',
                color: error ? '#FF3F3F' : '#FFFFFF',
                background: d
                  ? error
                    ? 'rgba(230,0,0,0.12)'
                    : 'rgba(230,0,0,0.08)'
                  : 'rgba(30,30,30,0.8)',
                border: `1.5px solid ${
                  error ? 'rgba(230,0,0,0.5)' : d ? 'rgba(230,0,0,0.3)' : 'rgba(255,255,255,0.10)'
                }`,
                borderRadius: '14px',
                outline: 'none',
                backdropFilter: 'blur(16px)',
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                caretColor: '#E60000',
              }}
            />
          ))}
        </motion.div>

        {/* Error / verifying feedback */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                color: '#FF3F3F',
                textAlign: 'center',
                marginTop: '14px',
              }}
            >
              Incorrect code — please try again
            </motion.p>
          )}
          {verifying && !error && (
            <motion.p
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                color: '#666',
                textAlign: 'center',
                marginTop: '14px',
              }}
            >
              Verifying…
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Resend */}
      <motion.div
        className="px-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#555', textAlign: 'center' }}>
          Didn't receive it?{' '}
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#A29191',
              cursor: 'pointer',
              fontSize: '13px',
              textDecoration: 'underline',
              fontFamily: 'inherit',
              padding: 0,
            }}
            onClick={() => {
              setDigits(Array(LENGTH).fill(''));
              setError(false);
              inputsRef.current[0]?.focus();
            }}
          >
            Resend code
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}
