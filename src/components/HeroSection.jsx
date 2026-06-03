import { motion } from 'framer-motion';

export default function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.3 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.0, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-6 z-10"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-glow-red select-none"
        style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 100,
          fontSize: 'clamp(72px, 16vw, 140px)',
          lineHeight: '0.9',
          letterSpacing: '-0.04em',
          color: '#FFFFFF',
        }}
        variants={fadeUp}
      >
        Vinto
      </motion.h1>

      <motion.div
        className="mt-3"
        variants={fadeUp}
      >
        <p
          className="select-none"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 3.5vw, 22px)',
            lineHeight: '1.3',
            color: '#A29191',
            letterSpacing: '0.02em',
          }}
        >
          Your AI companion
        </p>
      </motion.div>

      <motion.div
        className="mt-5"
        variants={fadeUp}
      >
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
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
        </span>
      </motion.div>
    </motion.div>
  );
}
