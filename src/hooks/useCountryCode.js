import { useState, useEffect } from 'react';

// Comprehensive dial-code list ordered by common usage
export const COUNTRY_CODES = [
  { code: 'GB', dial: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', dial: '+1',  name: 'United States',  flag: '🇺🇸' },
  { code: 'IN', dial: '+91', name: 'India',           flag: '🇮🇳' },
  { code: 'DE', dial: '+49', name: 'Germany',         flag: '🇩🇪' },
  { code: 'FR', dial: '+33', name: 'France',          flag: '🇫🇷' },
  { code: 'AU', dial: '+61', name: 'Australia',       flag: '🇦🇺' },
  { code: 'CA', dial: '+1',  name: 'Canada',          flag: '🇨🇦' },
  { code: 'AE', dial: '+971',name: 'UAE',             flag: '🇦🇪' },
  { code: 'ZA', dial: '+27', name: 'South Africa',    flag: '🇿🇦' },
  { code: 'NG', dial: '+234',name: 'Nigeria',         flag: '🇳🇬' },
  { code: 'BR', dial: '+55', name: 'Brazil',          flag: '🇧🇷' },
  { code: 'MX', dial: '+52', name: 'Mexico',          flag: '🇲🇽' },
  { code: 'JP', dial: '+81', name: 'Japan',           flag: '🇯🇵' },
  { code: 'CN', dial: '+86', name: 'China',           flag: '🇨🇳' },
  { code: 'KR', dial: '+82', name: 'South Korea',     flag: '🇰🇷' },
  { code: 'SG', dial: '+65', name: 'Singapore',       flag: '🇸🇬' },
  { code: 'NL', dial: '+31', name: 'Netherlands',     flag: '🇳🇱' },
  { code: 'IT', dial: '+39', name: 'Italy',           flag: '🇮🇹' },
  { code: 'ES', dial: '+34', name: 'Spain',           flag: '🇪🇸' },
  { code: 'SE', dial: '+46', name: 'Sweden',          flag: '🇸🇪' },
  { code: 'NO', dial: '+47', name: 'Norway',          flag: '🇳🇴' },
  { code: 'PL', dial: '+48', name: 'Poland',          flag: '🇵🇱' },
  { code: 'TR', dial: '+90', name: 'Turkey',          flag: '🇹🇷' },
  { code: 'PK', dial: '+92', name: 'Pakistan',        flag: '🇵🇰' },
  { code: 'BD', dial: '+880',name: 'Bangladesh',      flag: '🇧🇩' },
  { code: 'PH', dial: '+63', name: 'Philippines',     flag: '🇵🇭' },
  { code: 'ID', dial: '+62', name: 'Indonesia',       flag: '🇮🇩' },
  { code: 'MY', dial: '+60', name: 'Malaysia',        flag: '🇲🇾' },
  { code: 'TH', dial: '+66', name: 'Thailand',        flag: '🇹🇭' },
  { code: 'EG', dial: '+20', name: 'Egypt',           flag: '🇪🇬' },
  { code: 'SA', dial: '+966',name: 'Saudi Arabia',    flag: '🇸🇦' },
  { code: 'KE', dial: '+254',name: 'Kenya',           flag: '🇰🇪' },
  { code: 'GH', dial: '+233',name: 'Ghana',           flag: '🇬🇭' },
  { code: 'AR', dial: '+54', name: 'Argentina',       flag: '🇦🇷' },
  { code: 'CO', dial: '+57', name: 'Colombia',        flag: '🇨🇴' },
  { code: 'NZ', dial: '+64', name: 'New Zealand',     flag: '🇳🇿' },
  { code: 'IE', dial: '+353',name: 'Ireland',         flag: '🇮🇪' },
  { code: 'PT', dial: '+351',name: 'Portugal',        flag: '🇵🇹' },
  { code: 'CH', dial: '+41', name: 'Switzerland',     flag: '🇨🇭' },
  { code: 'BE', dial: '+32', name: 'Belgium',         flag: '🇧🇪' },
  { code: 'AT', dial: '+43', name: 'Austria',         flag: '🇦🇹' },
  { code: 'DK', dial: '+45', name: 'Denmark',         flag: '🇩🇰' },
  { code: 'FI', dial: '+358',name: 'Finland',         flag: '🇫🇮' },
  { code: 'HK', dial: '+852',name: 'Hong Kong',       flag: '🇭🇰' },
  { code: 'TW', dial: '+886',name: 'Taiwan',          flag: '🇹🇼' },
  { code: 'VN', dial: '+84', name: 'Vietnam',         flag: '🇻🇳' },
  { code: 'RU', dial: '+7',  name: 'Russia',          flag: '🇷🇺' },
  { code: 'UA', dial: '+380',name: 'Ukraine',         flag: '🇺🇦' },
  { code: 'IL', dial: '+972',name: 'Israel',          flag: '🇮🇱' },
  { code: 'GR', dial: '+30', name: 'Greece',          flag: '🇬🇷' },
];

const FALLBACK = COUNTRY_CODES[0]; // UK as default

/**
 * Detects user's country via ip-api.com (free, no key required, ~45 calls/min).
 * Returns { country, loading, error } where country matches COUNTRY_CODES entries.
 */
export function useCountryCode() {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch('https://ip-api.com/json/?fields=countryCode', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const match = COUNTRY_CODES.find((c) => c.code === data.countryCode);
        setCountry(match || FALLBACK);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setCountry(FALLBACK);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { country, loading, error };
}
