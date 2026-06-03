'use client';

import { useRef, useState, useTransition } from 'react';
import { useToast } from './Toast';
import type { ActionResult } from '@/lib/admin/types';

// Two-tap delete, no modal. First tap arms ("Tap again to remove") for 3s,
// second tap runs the action. Calls onDone (e.g. optimistic removal) on success.
export default function DangerConfirm({
  onConfirm,
  onDone,
  label = 'Remove',
  armedLabel = 'Tap again to remove',
}: {
  onConfirm: () => Promise<ActionResult>;
  onDone?: () => void;
  label?: string;
  armedLabel?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [pending, start] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useToast();

  const click = () => {
    if (!armed) {
      setArmed(true);
      timer.current = setTimeout(() => setArmed(false), 3000);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    start(async () => {
      const res = await onConfirm();
      if (res.ok) {
        toast.show('Removed');
        onDone?.();
      } else {
        setArmed(false);
        toast.show(res.error, 'error');
      }
    });
  };

  return (
    <button type="button" className={`danger-btn${armed ? ' armed' : ''}`} onClick={click} disabled={pending}>
      {armed ? armedLabel : label}
    </button>
  );
}
