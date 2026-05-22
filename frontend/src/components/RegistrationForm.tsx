"use client";

import { useState, type FormEvent } from "react";
import { register } from "@/lib/api";
import { saveUser } from "@/lib/auth";

interface Props {
  onSuccess: () => void;
}

export default function RegistrationForm({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await register({ name: name.trim(), email: email.trim(), website: website.trim() || undefined });
      saveUser({ name: name.trim(), email: email.trim() });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reg-name" className="block text-sm font-medium text-slate-700 mb-1.5">
          Full Name
        </label>
        <input
          id="reg-name"
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          required
        />
      </div>
      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1.5">
          Email Address
        </label>
        <input
          id="reg-email"
          type="email"
          placeholder="jane@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
      </div>
      <div>
        <label htmlFor="reg-website" className="block text-sm font-medium text-slate-700 mb-1.5">
          Your Website <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          id="reg-website"
          type="text"
          placeholder="example.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="input-field"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <button type="submit" disabled={loading || !name.trim() || !email.trim()} className="btn-primary w-full">
        {loading ? "Creating account…" : "Get Your Free Report"}
      </button>

      <p className="text-xs text-center text-slate-400">
        No credit card required. Your report will be emailed to you.
      </p>
    </form>
  );
}
