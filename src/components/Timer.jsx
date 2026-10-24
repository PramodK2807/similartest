import { useEffect, useRef, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

// Owns its own clock so the question list is not re-rendered every second.
export default function Timer({ seconds, onExpire }) {
  const [left, setLeft] = useState(seconds);
  const endsAt = useRef(Date.now() + seconds * 1000);
  const expired = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0 && !expired.current) {
        expired.current = true;
        clearInterval(id);
        onExpire();
      }
    }, 250);
    return () => clearInterval(id);
  }, [onExpire]);

  const mm = Math.floor(left / 60);
  const ss = left % 60;

  return (
    <div className={`timer${left <= 60 ? ' low' : ''}`} role="timer" aria-label="Time left">
      <span className="timer-label">Time left</span>
      <span className="timer-value">
        {pad(mm)}:{pad(ss)}
      </span>
    </div>
  );
}
