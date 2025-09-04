"use client";

import { signIn } from "@/client/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () =>
      signIn.email({ email, password, rememberMe: true, callbackURL: "/" }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-md border p-6 shadow-sm"
      >
        <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>

        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded border px-3 py-2"
          placeholder="you@example.com"
        />

        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full rounded border px-3 py-2"
          placeholder="Your password"
        />

        {mutation.isError && (
          <div className="mb-4 text-sm text-red-600">
            {mutation.error?.message ?? "Sign in failed"}
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded bg-sky-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {mutation.isPending ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-muted-foreground mt-3 text-sm">
          Don’t have an account? Create one via your app-specific sign-up flow.
        </p>
      </form>
    </div>
  );
}
