'use client';

import { useState, useTransition } from 'react';
import { setItemAvailable, setSectionVisible } from '@/lib/admin/actions';
import { useToast } from './Toast';

// Optimistic on/off switch. "item" controls availability (Showing / Hidden),
// "section" controls visibility on the customer site.
export default function Toggle({
  id,
  on: initial,
  kind,
}: {
  id: string;
  on: boolean;
  kind: 'item' | 'section';
}) {
  const [on, setOn] = useState(initial);
  const [pending, start] = useTransition();
  const toast = useToast();

  const copy =
    kind === 'item'
      ? { on: 'Showing', off: 'Hidden', onMsg: 'Back on the menu', offMsg: 'Hidden from menu' }
      : { on: 'Shown', off: 'Hidden', onMsg: 'Section shown', offMsg: 'Section hidden' };

  const toggle = () => {
    const next = !on;
    setOn(next);
    start(async () => {
      const res = kind === 'item' ? await setItemAvailable(id, next) : await setSectionVisible(id, next);
      if (!res.ok) {
        setOn(!next);
        toast.show(res.error, 'error');
      } else {
        toast.show(next ? copy.onMsg : copy.offMsg);
      }
    });
  };

  return (
    <button
      type="button"
      className={`toggle${on ? ' on' : ''}`}
      onClick={toggle}
      disabled={pending}
      aria-pressed={on}
    >
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      <span className="toggle-text">{on ? copy.on : copy.off}</span>
    </button>
  );
}
