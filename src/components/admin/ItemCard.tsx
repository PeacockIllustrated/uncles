'use client';

import InlineText from './InlineText';
import InlinePrice from './InlinePrice';
import Toggle from './Toggle';
import DangerConfirm from './DangerConfirm';
import { deleteItem } from '@/lib/admin/actions';
import type { AdminItem } from '@/lib/admin/types';

export default function ItemCard({ item, onRemoved }: { item: AdminItem; onRemoved: () => void }) {
  return (
    <div className="item-card">
      <div className="item-card-head">
        <InlineText itemId={item.id} field="name" value={item.name} placeholder="Item name" />
        <Toggle id={item.id} on={item.available} kind="item" />
      </div>

      <InlineText
        itemId={item.id}
        field="description"
        value={item.description}
        placeholder="Add a description (optional)"
        multiline
      />

      <div className="item-sizes">
        {item.sizes.map((size) => (
          <InlinePrice
            key={size.id}
            sizeId={size.id}
            pricePence={size.price_pence}
            label={size.size_label}
          />
        ))}
      </div>

      <div className="item-card-foot">
        <DangerConfirm onConfirm={() => deleteItem(item.id)} onDone={onRemoved} />
      </div>
    </div>
  );
}
