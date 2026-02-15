"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Unlock, Loader2 } from "lucide-react";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  revealAt: string;
  isUnlocked: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchMessages();
    }
  }, [status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const lockedMessages = messages.filter((m) => !m.isUnlocked);
  const unlockedMessages = messages.filter((m) => m.isUnlocked);

  return (
    <div className="space-y-12 p-8">
      <section>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-white">
          <Unlock className="w-6 h-6 text-green-400" />
          Unlocked Memories
        </h2>
        {unlockedMessages.length === 0 ? (
          <p className="text-gray-500 italic">No unlocked messages yet. Time is still ticking...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="cursor-pointer group"
                // Implement navigation to detail view later
              >
                <Card className="hover:bg-zinc-900 transition-colors border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-6">
                    <p className="text-gray-300 line-clamp-3">{msg.content}</p>
                    <p className="text-xs text-gray-500 mt-4">
                      Revealed {formatDistanceToNow(new Date(msg.revealAt), { addSuffix: true })}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-white">
          <Lock className="w-6 h-6 text-red-400" />
          Locked Capsules
        </h2>
        {lockedMessages.length === 0 ? (
          <p className="text-gray-500 italic">No locked messages. Write one for your future self.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-xl"
              >
                <Card className="bg-zinc-950 border-zinc-800 opacity-70 hover:opacity-100 transition-opacity">
                  <CardContent className="p-6 flex flex-col items-center justify-center min-h-[150px] space-y-4">
                    <Lock className="w-8 h-8 text-gray-600" />
                    <div className="text-center">
                      <p className="text-sm text-gray-400 font-mono">Unlocks in</p>
                      <p className="text-lg font-bold text-white">
                        {formatDistanceToNow(new Date(msg.revealAt))}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
