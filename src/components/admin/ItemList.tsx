'use client';

import { useState } from 'react';
import ItemCard from './ItemCard';
import AddItemSheet from './AddItemSheet';
import type { AdminItem } from '@/lib/admin/types';

// Holds the item list so add/remove can update optimistically without a reload.
export default function ItemList({
  sectionId,
  sectionSlug,
  items: initial,
}: {
  sectionId: string;
  sectionSlug: string;
  items: AdminItem[];
}) {
  const [items, setItems] = useState(initial);
  const dualPrice = sectionSlug === 'panuozzi' || sectionSlug === 'extras';

  return (
    <>
      {items.length === 0 ? (
        <p className="admin-empty">This section is empty. Add an item below.</p>
      ) : (
        <div className="item-list">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onRemoved={() => setItems((xs) => xs.filter((x) => x.id !== item.id))}
            />
          ))}
        </div>
      )}

      <AddItemSheet
        sectionId={sectionId}
        dualPrice={dualPrice}
        onAdded={(item) => setItems((xs) => [...xs, item])}
      />
    </>
  );
}
