import React from 'react';
import { sanitizeIndianPhoneDigits } from '../utils/phone';

interface IndianPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  inputClassName?: string;
  prefixClassName?: string;
  placeholder?: string;
  required?: boolean;
}

const IndianPhoneInput: React.FC<IndianPhoneInputProps> = ({
  value,
  onChange,
  disabled = false,
  inputClassName = '',
  prefixClassName = '',
  placeholder = '9876543210',
  required = false,
}) => {
  return (
    <div className="flex items-center">
      <div
        className={`flex items-center gap-2 shrink-0 select-none border-r border-navy/10 text-navy font-black ${prefixClassName}`}
        aria-label="India country code locked to +91"
      >
        <IndiaFlag />
        <span>+91</span>
      </div>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        pattern="[0-9]{10}"
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClassName}
        value={value}
        onChange={(e) => onChange(sanitizeIndianPhoneDigits(e.target.value))}
      />
    </div>
  );
};

function IndiaFlag() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 36 24"
      className="h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] shadow-sm ring-1 ring-navy/10"
    >
      <rect width="36" height="8" fill="#FF9933" />
      <rect y="8" width="36" height="8" fill="#FFFFFF" />
      <rect y="16" width="36" height="8" fill="#138808" />
      <circle cx="18" cy="12" r="3" fill="none" stroke="#000080" strokeWidth="0.8" />
      <g stroke="#000080" strokeWidth="0.35" strokeLinecap="round">
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * 30 * Math.PI) / 180;
          const x = 18 + Math.cos(angle) * 2.6;
          const y = 12 + Math.sin(angle) * 2.6;

          return <line key={index} x1="18" y1="12" x2={x} y2={y} />;
        })}
      </g>
    </svg>
  );
}

export default IndianPhoneInput;
