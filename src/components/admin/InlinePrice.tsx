'use client';

import { useRef, useState } from 'react';
import { updatePrice } from '@/lib/admin/actions';
import { useToast } from './Toast';

const fmt = (pence: number) => (pence / 100).toFixed(2);

function parsePounds(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  if (!cleaned) return null;
  const pence = Math.round(parseFloat(cleaned) * 100);
  return Number.isFinite(pence) && pence >= 0 ? pence : null;
}

// Tap-to-edit price. Looks like plain gold text until focused. Debounced
// auto-save (600ms), optimistic, rolls back and toasts on failure. Enter saves.
export default function InlinePrice({
  sizeId,
  pricePence,
  label,
}: {
  sizeId: string;
  pricePence: number;
  label: string | null;
}) {
  const [value, setValue] = useState(fmt(pricePence));
  const savedRef = useRef(pricePence);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useToast();

  const commit = async (raw: string) => {
    const pence = parsePounds(raw);
    if (pence === null) {
      setValue(fmt(savedRef.current));
      toast.show('That price did not look right', 'error');
      return;
    }
    if (pence === savedRef.current) {
      setValue(fmt(pence));
      return;
    }
    const prev = savedRef.current;
    savedRef.current = pence;
    setValue(fmt(pence));
    const res = await updatePrice(sizeId, pence);
    if (res.ok) {
      toast.show('Saved');
    } else {
      savedRef.current = prev;
      setValue(fmt(prev));
      toast.show(res.error, 'error');
    }
  };

  const onChange = (raw: string) => {
    setValue(raw);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(raw), 600);
  };

  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    commit(value);
  };

  return (
    <label className="inline-price">
      {label ? <span className="inline-price-label">{label}</span> : null}
      <span className="inline-price-field">
        <span className="inline-price-currency">£</span>
        <input
          inputMode="decimal"
          className="inline-price-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={flush}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </span>
    </label>
  );
}
