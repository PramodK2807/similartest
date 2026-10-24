export function InfoIcon({ label }) {
  return (
    <span className="info" title={label} aria-hidden="true">
      i
    </span>
  );
}

const base = { width: 15, height: 15, viewBox: '0 0 16 16', 'aria-hidden': true };

export function QuestionIcon() {
  return (
    <svg {...base} fill="none" stroke="#3a9ad9" strokeWidth="1.4">
      <circle cx="8" cy="8" r="6.3" />
      <path d="M6.1 6.3a2 2 0 1 1 2.9 1.8c-.7.4-1 .8-1 1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.6" r=".6" fill="#3a9ad9" stroke="none" />
    </svg>
  );
}

export function MarksIcon() {
  return (
    <svg {...base} fill="none" stroke="#f0a050" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M3.5 1.8h6l3 3v9.4h-9z" />
      <path d="M9.5 1.8v3h3M5.5 8h5M5.5 10.5h5" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg {...base} fill="none" stroke="#5fbb3f" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="8" cy="8" r="6.3" />
      <path d="M8 4.5V8l2.4 1.5" />
    </svg>
  );
}
