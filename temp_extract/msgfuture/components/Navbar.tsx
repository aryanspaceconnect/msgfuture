"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-black text-white p-4 border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-widest uppercase hover:text-gray-300 transition-colors">
          MsgFuture
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/echo" className="hover:text-gray-300 transition-colors">Echo Wall</Link>

          {session ? (
            <>
              <Link href="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
              <Link href="/compose" className="hover:text-gray-300 transition-colors">Compose</Link>
              <Link href="/settings" className="hover:text-gray-300 transition-colors">Settings</Link>
              <div className="flex items-center space-x-2">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full border border-gray-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700"></div>
                )}
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-gray-900 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
