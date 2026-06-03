'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { saveNews, setNewsPublished, deleteNews } from '@/lib/admin/actions';
import { useToast } from './Toast';
import DangerConfirm from './DangerConfirm';
import type { AdminNews } from '@/lib/admin/types';

const dateOnly = (iso: string | null) => (iso ? iso.slice(0, 10) : '');

function Editor({
  initial,
  onSaved,
  onCancel,
}: {
  initial: AdminNews | null;
  onSaved: (n: AdminNews) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [startsAt, setStartsAt] = useState(dateOnly(initial?.starts_at ?? null));
  const [endsAt, setEndsAt] = useState(dateOnly(initial?.ends_at ?? null));
  const [published, setPublished] = useState(initial?.published ?? false);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const save = async () => {
    if (!title.trim()) {
      toast.show('Give the post a title', 'error');
      return;
    }
    setBusy(true);
    const res = await saveNews({
      id: initial?.id,
      title,
      body,
      published,
      startsAt: startsAt || null,
      endsAt: endsAt || null,
    });
    setBusy(false);
    if (!res.ok) {
      toast.show(res.error, 'error');
      return;
    }
    toast.show('Saved');
    onSaved({
      id: res.id,
      title: title.trim(),
      body: body.trim() || null,
      published,
      starts_at: startsAt || null,
      ends_at: endsAt || null,
    });
  };

  return (
    <div className="sheet">
      <div className="sheet-title">{initial ? 'Edit post' : 'New post'}</div>
      <input className="sheet-input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      <textarea
        className="sheet-input"
        placeholder="What do you want to tell customers?"
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="sheet-dates">
        <label className="sheet-date">
          <span>Show from</span>
          <input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
        </label>
        <label className="sheet-date">
          <span>Hide after</span>
          <input type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        </label>
      </div>
      <label className="sheet-check">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Show this on the website now
      </label>
      <div className="sheet-actions">
        <button type="button" className="sheet-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="sheet-save" onClick={save} disabled={busy}>
          {busy ? 'Saving...' : 'Save post'}
        </button>
      </div>
    </div>
  );
}

export default function NewsManager({ news: initial }: { news: AdminNews[] }) {
  const [news, setNews] = useState(initial);
  const [editing, setEditing] = useState<AdminNews | 'new' | null>(null);
  const toast = useToast();

  const upsert = (n: AdminNews) => {
    setNews((xs) => (xs.some((x) => x.id === n.id) ? xs.map((x) => (x.id === n.id ? n : x)) : [n, ...xs]));
    setEditing(null);
  };

  const togglePublish = async (n: AdminNews) => {
    const next = !n.published;
    setNews((xs) => xs.map((x) => (x.id === n.id ? { ...x, published: next } : x)));
    const res = await setNewsPublished(n.id, next);
    if (!res.ok) {
      setNews((xs) => xs.map((x) => (x.id === n.id ? { ...x, published: !next } : x)));
      toast.show(res.error, 'error');
    } else {
      toast.show(next ? 'Now showing on the website' : 'Hidden');
    }
  };

  if (editing) {
    return (
      <Editor
        initial={editing === 'new' ? null : editing}
        onSaved={upsert}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const active = news.filter((n) => n.published);
  const drafts = news.filter((n) => !n.published);

  return (
    <>
      {news.length === 0 ? (
        <p className="admin-empty">No news posts yet. Your first might announce opening day.</p>
      ) : null}

      {active.map((n) => (
        <NewsRow key={n.id} n={n} onEdit={() => setEditing(n)} onToggle={() => togglePublish(n)} onRemoved={() => setNews((xs) => xs.filter((x) => x.id !== n.id))} />
      ))}

      {drafts.length > 0 ? <div className="news-drafts-label">Drafts ({drafts.length})</div> : null}
      {drafts.map((n) => (
        <NewsRow key={n.id} n={n} onEdit={() => setEditing(n)} onToggle={() => togglePublish(n)} onRemoved={() => setNews((xs) => xs.filter((x) => x.id !== n.id))} />
      ))}

      <button type="button" className="add-btn" onClick={() => setEditing('new')}>
        <Plus size={16} strokeWidth={2} /> Write a new post
      </button>
    </>
  );
}

function NewsRow({
  n,
  onEdit,
  onToggle,
  onRemoved,
}: {
  n: AdminNews;
  onEdit: () => void;
  onToggle: () => void;
  onRemoved: () => void;
}) {
  return (
    <div className={`news-card${n.published ? '' : ' draft'}`}>
      <div className="news-card-title">{n.title}</div>
      {n.body ? <div className="news-card-body">{n.body}</div> : null}
      <div className="news-card-meta">
        {n.published ? 'Showing now' : 'Not published'}
        {n.ends_at ? ` · until ${dateOnly(n.ends_at)}` : ''}
      </div>
      <div className="news-card-actions">
        <button type="button" className="ghost-btn" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="ghost-btn" onClick={onToggle}>
          {n.published ? 'Hide' : 'Publish'}
        </button>
        <DangerConfirm onConfirm={() => deleteNews(n.id)} onDone={onRemoved} />
      </div>
    </div>
  );
}
