"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function HeaderUser() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Trigger (avatar + name) */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-100"
      >
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name ?? "User"}
            className="h-8 w-8 rounded-full"
          />
        )}
        <span className="text-sm font-medium">
          {session.user?.name ?? session.user?.email}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded border bg-white shadow-lg">
          <div className="border-b p-3">
            <button
              onClick={() => signOut()}
              className="w-full rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
            >
              Sign out
            </button>
          </div>
          <div className="max-h-64 overflow-auto p-3 font-mono text-xs text-gray-700">
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
