'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { addItem } from '@/lib/admin/actions';
import { useToast } from './Toast';
import type { AdminItem } from '@/lib/admin/types';

const toPence = (s: string): number => Math.round(parseFloat(s.replace(/[^0-9.]/g, '')) * 100);

// Add an item. Single price for simple sections, Classico/Grande for panuozzi
// and extras. Appends optimistically with the server-returned id.
export default function AddItemSheet({
  sectionId,
  dualPrice,
  onAdded,
}: {
  sectionId: string;
  dualPrice: boolean;
  onAdded: (item: AdminItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const reset = () => {
    setName('');
    setDesc('');
    setP1('');
    setP2('');
  };

  const submit = async () => {
    const sizes = dualPrice
      ? [
          { label: 'Classico', pricePence: toPence(p1) },
          { label: 'Grande', pricePence: toPence(p2) },
        ]
      : [{ label: null, pricePence: toPence(p1) }];

    if (!name.trim() || sizes.some((s) => !Number.isFinite(s.pricePence) || s.pricePence < 0)) {
      toast.show('Add a name and a price', 'error');
      return;
    }

    setBusy(true);
    const res = await addItem(sectionId, { name, description: desc || null, sizes });
    setBusy(false);
    if (!res.ok) {
      toast.show(res.error, 'error');
      return;
    }

    onAdded({
      id: res.id,
      slug: '',
      name: name.trim(),
      description: desc.trim() || null,
      available: true,
      is_feature: false,
      display_order: 9999,
      sizes: sizes.map((s, i) => ({
        id: `new-${res.id}-${i}`,
        size_label: s.label,
        price_pence: s.pricePence,
        note: null,
        display_order: (i + 1) * 10,
      })),
    });
    toast.show('Item added');
    reset();
    setOpen(false);
  };

  if (!open) {
    return (
      <button type="button" className="add-btn" onClick={() => setOpen(true)}>
        <Plus size={16} strokeWidth={2} /> Add a new item
      </button>
    );
  }

  return (
    <div className="sheet">
      <div className="sheet-title">New item</div>
      <input
        className="sheet-input"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <textarea
        className="sheet-input"
        placeholder="Description (optional)"
        rows={2}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <div className="sheet-prices">
        <label className="sheet-price">
          <span>{dualPrice ? 'Classico £' : 'Price £'}</span>
          <input inputMode="decimal" value={p1} onChange={(e) => setP1(e.target.value)} placeholder="0.00" />
        </label>
        {dualPrice ? (
          <label className="sheet-price">
            <span>Grande £</span>
            <input inputMode="decimal" value={p2} onChange={(e) => setP2(e.target.value)} placeholder="0.00" />
          </label>
        ) : null}
      </div>
      <div className="sheet-actions">
        <button
          type="button"
          className="sheet-cancel"
          onClick={() => {
            reset();
            setOpen(false);
          }}
        >
          Cancel
        </button>
        <button type="button" className="sheet-save" onClick={submit} disabled={busy}>
          {busy ? 'Adding...' : 'Add item'}
        </button>
      </div>
    </div>
  );
}
