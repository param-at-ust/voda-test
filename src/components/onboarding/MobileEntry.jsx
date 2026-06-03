import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountryCode, COUNTRY_CODES } from '../../hooks/useCountryCode';

// ─── Country Picker Sheet ────────────────────────────────────────────────────

function CountryPickerSheet({ current, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const filtered = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.dial.includes(query) ||
      c.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />

      <motion.div
        className="relative flex flex-col rounded-t-3xl overflow-hidden"
        style={{
          background: '#111111',
          maxHeight: '75vh',
          paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderBottom: 'none',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 shrink-0">
          <span style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, fontSize: '18px', color: '#FFF' }}>
            Select country
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#999',
              fontSize: 18,
            }}
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pb-3 shrink-0">
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code…"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: "'Inter', sans-serif",
                fontSize: '15px',
                color: '#FFF',
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16 }}>×</button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-3">
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#555', padding: '32px 0', fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
              No results
            </p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => { onSelect(c); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left"
                style={{
                  background: c.code === current?.code ? 'rgba(230,0,0,0.10)' : 'transparent',
                  border: c.code === current?.code ? '1px solid rgba(230,0,0,0.18)' : '1px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '2px',
                }}
              >
                <span style={{ fontSize: '22px', lineHeight: 1 }}>{c.flag}</span>
                <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#DFDFDF' }}>{c.name}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#666', fontVariantNumeric: 'tabular-nums' }}>{c.dial}</span>
                {c.code === current?.code && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E60000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Mobile Entry Screen ─────────────────────────────────────────────────────

export default function MobileEntry({ onBack, onContinue }) {
  const { country: detectedCountry, loading: geoLoading } = useCountryCode();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const inputRef = useRef(null);

  // Apply detected country once loaded
  useEffect(() => {
    if (detectedCountry && !selectedCountry) {
      setSelectedCountry(detectedCountry);
    }
  }, [detectedCountry, selectedCountry]);

  // Focus input after mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  const isValid = phone.replace(/\D/g, '').length >= 7;

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/[^\d\s\-().]/g, '');
    setPhone(raw);
  };

  const handleContinue = () => {
    if (isValid && selectedCountry) {
      onContinue?.({ country: selectedCountry, phone: phone.replace(/\D/g, '') });
    }
  };

  return (
    <>
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
        {/* Back button */}
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
            What's your<br />
            <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>
              mobile number?
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
            We'll send a one-time code to verify your number.
          </motion.p>
        </div>

        {/* Input group */}
        <motion.div
          className="px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div
            className="flex items-center gap-0 rounded-2xl overflow-hidden"
            style={{
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(30,30,30,0.8)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Country code button */}
            <button
              onClick={() => setPickerOpen(true)}
              className="flex items-center gap-2 px-4 py-4 shrink-0"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: 'none',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer',
                minWidth: 0,
              }}
            >
              {geoLoading && !selectedCountry ? (
                <span
                  className="inline-block w-5 h-5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.08)', animation: 'breathe 1.5s ease-in-out infinite' }}
                />
              ) : (
                <span style={{ fontSize: '20px', lineHeight: 1 }}>{selectedCountry?.flag}</span>
              )}
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '16px',
                  color: '#DFDFDF',
                  fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedCountry?.dial ?? '…'}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Phone input */}
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter mobile number"
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '16px 16px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: '16px',
                color: '#FFFFFF',
                letterSpacing: '0.02em',
              }}
            />
          </div>

          {/* Geo hint */}
          {selectedCountry && !geoLoading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px',
                color: '#555',
                marginTop: '10px',
                paddingLeft: '4px',
              }}
            >
              {selectedCountry.flag} Detected as {selectedCountry.name} — not right?{' '}
              <button
                onClick={() => setPickerOpen(true)}
                style={{ background: 'none', border: 'none', color: '#A29191', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline', padding: 0, fontFamily: 'inherit' }}
              >
                Change
              </button>
            </motion.p>
          )}
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Continue CTA */}
        <motion.div
          className="px-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <button
            onClick={handleContinue}
            disabled={!isValid}
            style={{
              width: '100%',
              padding: '18px 24px',
              borderRadius: '16px',
              border: 'none',
              cursor: isValid ? 'pointer' : 'not-allowed',
              background: isValid ? '#E60000' : 'rgba(230,0,0,0.18)',
              transition: 'background 0.25s ease, opacity 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isValid && (
              <span
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 60%)' }}
              />
            )}
            <span
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 600,
                fontSize: '17px',
                letterSpacing: '0.01em',
                color: isValid ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
                position: 'relative',
              }}
            >
              Send code
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Country Picker Sheet */}
      <AnimatePresence>
        {pickerOpen && (
          <CountryPickerSheet
            current={selectedCountry}
            onSelect={setSelectedCountry}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
