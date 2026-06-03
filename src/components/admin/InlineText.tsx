'use client';

import { useRef, useState } from 'react';
import { updateItemText } from '@/lib/admin/actions';
import { useToast } from './Toast';

// Tap-to-edit item name or description. Debounced auto-save, rolls back on error.
export default function InlineText({
  itemId,
  field,
  value: initial,
  placeholder,
  multiline = false,
}: {
  itemId: string;
  field: 'name' | 'description';
  value: string | null;
  placeholder?: string;
  multiline?: boolean;
}) {
  const [value, setValue] = useState(initial ?? '');
  const savedRef = useRef(initial ?? '');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useToast();

  const commit = async (next: string) => {
    if (next === savedRef.current) return;
    if (field === 'name' && !next.trim()) {
      setValue(savedRef.current);
      toast.show('Name cannot be empty', 'error');
      return;
    }
    const prev = savedRef.current;
    savedRef.current = next;
    const res = await updateItemText(
      itemId,
      field === 'name' ? { name: next } : { description: next },
    );
    if (res.ok) {
      toast.show('Saved');
    } else {
      savedRef.current = prev;
      setValue(prev);
      toast.show(res.error, 'error');
    }
  };

  const onChange = (next: string) => {
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(next), 700);
  };

  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    commit(value);
  };

  const className = `inline-text ${field === 'name' ? 'inline-name' : 'inline-desc'}`;

  if (multiline) {
    return (
      <textarea
        className={className}
        rows={2}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={flush}
      />
    );
  }

  return (
    <input
      className={className}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onBlur={flush}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  );
}
