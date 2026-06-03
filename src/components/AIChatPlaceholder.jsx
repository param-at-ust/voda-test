import { motion } from 'framer-motion';

export default function AIChatPlaceholder() {
  return (
    <motion.div
      className="w-full px-6 z-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        className="glass-surface animate-pulse-ring mx-auto flex items-center gap-3 px-5 py-4"
        style={{
          maxWidth: '420px',
          borderRadius: '28px',
          border: '1px solid rgba(230, 0, 0, 0.06)',
        }}
      >
        <motion.span
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
          className="shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E60000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </motion.span>

        <input
          type="text"
          disabled
          placeholder="Ask Vinto anything..."
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-vinto-muted"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: '15px',
            opacity: 0.6,
          }}
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center shrink-0 rounded-full"
          style={{
            width: '38px',
            height: '38px',
            background: 'rgba(230, 0, 0, 0.15)',
            border: '1px solid rgba(230, 0, 0, 0.25)',
          }}
          aria-label="Voice input"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E60000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </motion.button>
      </div>

      <motion.div
        className="mt-3 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: '11px',
            color: '#666666',
            letterSpacing: '0.02em',
          }}
        >
          AI conversations coming soon
        </span>
      </motion.div>
    </motion.div>
  );
}
