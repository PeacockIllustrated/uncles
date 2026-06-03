'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

// Magic-link sign-in for Roma (no password). A dev-only password path is shown
// when NEXT_PUBLIC_DEV_LOGIN=true, for local testing without an email round-trip.
export default function LoginForm({ devLogin }: { devLogin: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/admin/auth/callback` },
    });
    setBusy(false);
    if (error) setError('Could not send the link. Check the address and try again.');
    else setSent(true);
  };

  const signInPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError('Wrong email or password.');
    else {
      router.push('/admin');
      router.refresh();
    }
  };

  if (sent) {
    return (
      <div className="login-sent">
        <p className="login-sent-title">Check your email</p>
        <p className="login-sent-body">
          We sent a sign-in link to <strong>{email}</strong>. Open it on this phone to sign in.
        </p>
        <button type="button" className="login-link-btn" onClick={() => setSent(false)}>
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form className="login-form" onSubmit={sendLink}>
      <label className="login-label" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        autoComplete="email"
        required
      />

      {devLogin ? (
        <>
          <label className="login-label" htmlFor="password">
            Password (dev)
          </label>
          <input
            id="password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </>
      ) : null}

      {error ? <p className="login-error">{error}</p> : null}

      <button type="submit" className="login-submit" disabled={busy}>
        {busy ? 'One moment...' : 'Send me a sign-in link'}
      </button>

      {devLogin ? (
        <button type="button" className="login-dev" onClick={signInPassword} disabled={busy}>
          Dev sign in with password
        </button>
      ) : null}

      <p className="login-help">Need access? Contact Tom.</p>
    </form>
  );
}
