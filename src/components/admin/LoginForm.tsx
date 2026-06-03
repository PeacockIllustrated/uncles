'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

// Email + password sign-in for Roma.
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) {
      setError('Wrong email or password.');
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <form className="login-form" onSubmit={signIn}>
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

      <label className="login-label" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      {error ? <p className="login-error">{error}</p> : null}

      <button type="submit" className="login-submit" disabled={busy}>
        {busy ? 'Signing in...' : 'Sign in'}
      </button>

      <p className="login-help">Need access? Contact Tom.</p>
    </form>
  );
}
