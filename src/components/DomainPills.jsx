import { motion } from 'framer-motion';
import { useRef } from 'react';

const domains = [
  { label: 'Connectivity', icon: '⚡' },
  { label: 'Security', icon: '🛡' },
  { label: 'Travel', icon: '✈' },
  { label: 'Entertainment', icon: '◈' },
  { label: 'Smart Home', icon: '⌂' },
];

export default function DomainPills() {
  const scrollRef = useRef(null);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 1.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="w-full z-10 mt-5"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <div
        ref={scrollRef}
        className="flex gap-2 px-6 overflow-x-auto no-scrollbar"
        style={{
          scrollSnapType: 'x proximity',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '4px',
        }}
      >
        {domains.map((domain) => (
          <motion.button
            key={domain.label}
            variants={fadeUp}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 shrink-0 px-4 py-2.5 border border-white/[0.04] transition-all duration-200"
            style={{
              background: '#111111',
              borderRadius: '20px',
              scrollSnapAlign: 'start',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(230, 0, 0, 0.3)';
              e.currentTarget.style.background = '#1A1A1A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.background = '#111111';
            }}
          >
            <span className="text-xs leading-none shrink-0">{domain.icon}</span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: '12px',
                color: '#DFDFDF',
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
              }}
            >
              {domain.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
