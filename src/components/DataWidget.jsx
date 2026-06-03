import { motion } from 'framer-motion';

const DUMMY = {
  totalGB: 50,
  usedGB: 32.4,
  remainingGB: 17.6,
  daysLeft: 12,
  resetDate: 'Jun 15, 2026',
};

function CircularProgress({ used, total, size = 120, stroke = 6 }) {
  const pct = Math.min(1, used / total);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      {/* Background ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      {/* Progress ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="url(#dataGradient)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
      {/* Gradient definition */}
      <defs>
        <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF3F3F" />
          <stop offset="100%" stopColor="#E60000" />
        </linearGradient>
      </defs>
      {/* Center text: large number */}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FFFFFF"
        fontFamily="'Inter', sans-serif"
        fontWeight="700"
        fontSize="28"
        letterSpacing="-0.02em"
      >
        {DUMMY.remainingGB}
      </text>
      {/* Center text: unit */}
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#A29191"
        fontFamily="'Inter', sans-serif"
        fontWeight="500"
        fontSize="12"
        letterSpacing="0.04em"
      >
        GB
      </text>
    </svg>
  );
}

export default function DataWidget() {
  const pct = (DUMMY.usedGB / DUMMY.totalGB) * 100;

  return (
    <motion.div
      className="w-full px-6 z-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: '420px',
          background: 'rgba(30, 30, 30, 0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          padding: '20px 24px',
        }}
      >
        {/* Top row: ring + summary */}
        <div className="flex items-center gap-5">
          <CircularProgress used={DUMMY.usedGB} total={DUMMY.totalGB} />

          <div className="flex-1 min-w-0">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '14px',
                color: '#DFDFDF',
                lineHeight: '1.3',
              }}
            >
              Data remaining
            </p>
            <p
              className="mt-0.5"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: '12px',
                color: '#666666',
                lineHeight: '1.3',
              }}
            >
              {DUMMY.usedGB} GB used of {DUMMY.totalGB} GB
            </p>

            {/* Linear progress bar */}
            <div
              className="mt-3 w-full rounded-full overflow-hidden"
              style={{
                height: '4px',
                background: 'rgba(255, 255, 255, 0.06)',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #E60000, #FF3F3F)',
                }}
              />
            </div>

            {/* Days left */}
            <div
              className="mt-2.5 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#E60000' }} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '11px',
                  color: '#A29191',
                }}
              >
                {DUMMY.daysLeft} days left · Resets {DUMMY.resetDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
