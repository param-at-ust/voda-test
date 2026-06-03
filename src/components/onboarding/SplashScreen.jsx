import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function SplashScreen({ onSignUp }) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-between w-full h-full"
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 60px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 48px)',
      }}
    >
      {/* Brand mark */}
      <motion.div
        className="flex flex-col items-center"
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-glow-red select-none"
          custom={0.2}
          variants={fadeUp}
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 100,
            fontSize: 'clamp(88px, 20vw, 160px)',
            lineHeight: '0.9',
            letterSpacing: '-0.04em',
            color: '#FFFFFF',
          }}
        >
          Vinto
        </motion.h1>

        <motion.p
          custom={0.45}
          variants={fadeUp}
          className="mt-4 select-none"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(17px, 3.8vw, 23px)',
            color: '#A29191',
            letterSpacing: '0.02em',
          }}
        >
          Your AI companion
        </motion.p>

        <motion.span
          custom={0.6}
          variants={fadeUp}
          className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            background: 'rgba(230, 0, 0, 0.08)',
            border: '1px solid rgba(230, 0, 0, 0.15)',
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full animate-breathe"
            style={{ background: '#E60000' }}
          />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '11px',
              color: '#DFDFDF',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Powered by AI
          </span>
        </motion.span>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="w-full px-6 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <button
          onClick={onSignUp}
          className="w-full relative overflow-hidden rounded-2xl"
          style={{
            maxWidth: '400px',
            padding: '18px 24px',
            background: '#E60000',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {/* Subtle gloss overlay */}
          <span
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 60%)',
            }}
          />
          <span
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 600,
              fontSize: '17px',
              letterSpacing: '0.01em',
              color: '#FFFFFF',
              position: 'relative',
            }}
          >
            Get started
          </span>
        </button>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            color: '#666666',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          By continuing you agree to our{' '}
          <span style={{ color: '#A29191', textDecoration: 'underline', cursor: 'pointer' }}>
            Terms
          </span>{' '}
          &{' '}
          <span style={{ color: '#A29191', textDecoration: 'underline', cursor: 'pointer' }}>
            Privacy Policy
          </span>
        </p>
      </motion.div>
    </div>
  );
}
