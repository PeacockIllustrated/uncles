'use client';

import { useState } from 'react';
import { saveSettings } from '@/lib/admin/actions';
import { useToast } from './Toast';
import type { Settings } from '@/lib/types';

const DAYS: { key: string; label: string }[] = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

export default function SettingsForm({ settings }: { settings: Settings }) {
  const initialHours = (settings.opening_hours as Record<string, string> | null) ?? {};
  const [form, setForm] = useState({
    tagline: settings.tagline ?? '',
    address_line1: settings.address_line1 ?? '',
    address_line2: settings.address_line2 ?? '',
    postcode: settings.postcode ?? '',
    phone: settings.phone ?? '',
    email: settings.email ?? '',
    google_maps_url: settings.google_maps_url ?? '',
  });
  const [hours, setHours] = useState<Record<string, string>>(initialHours);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setBusy(true);
    const res = await saveSettings({
      tagline: form.tagline || null,
      address_line1: form.address_line1 || null,
      address_line2: form.address_line2 || null,
      postcode: form.postcode || null,
      phone: form.phone || null,
      email: form.email || null,
      google_maps_url: form.google_maps_url || null,
      opening_hours: Object.keys(hours).length ? hours : null,
    });
    setBusy(false);
    toast.show(res.ok ? 'Settings saved' : res.error, res.ok ? 'success' : 'error');
  };

  return (
    <div className="settings-form">
      <div className="settings-group">
        <div className="settings-label">Tagline</div>
        <textarea className="settings-input" rows={2} value={form.tagline} onChange={set('tagline')} />
      </div>

      <div className="settings-group">
        <div className="settings-label">Address</div>
        <input className="settings-input" placeholder="Address line 1" value={form.address_line1} onChange={set('address_line1')} />
        <input className="settings-input" placeholder="Address line 2" value={form.address_line2} onChange={set('address_line2')} />
        <input className="settings-input" placeholder="Postcode" value={form.postcode} onChange={set('postcode')} />
      </div>

      <div className="settings-group">
        <div className="settings-label">Contact</div>
        <input className="settings-input" placeholder="Phone" value={form.phone} onChange={set('phone')} />
        <input className="settings-input" placeholder="Email" value={form.email} onChange={set('email')} />
      </div>

      <div className="settings-group">
        <div className="settings-label">Opening hours</div>
        {DAYS.map((d) => (
          <div className="settings-day" key={d.key}>
            <span className="settings-day-label">{d.label}</span>
            <input
              className="settings-input"
              placeholder="e.g. 11:00 - 21:00 or Closed"
              value={hours[d.key] ?? ''}
              onChange={(e) => setHours((h) => ({ ...h, [d.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <div className="settings-group">
        <div className="settings-label">Google Maps link</div>
        <input className="settings-input" placeholder="https://maps.app.goo.gl/..." value={form.google_maps_url} onChange={set('google_maps_url')} />
      </div>

      <button type="button" className="settings-save" onClick={save} disabled={busy}>
        {busy ? 'Saving...' : 'Save settings'}
      </button>
    </div>
  );
}
