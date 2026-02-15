"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Unlock, Loader2, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDistanceToNow, format } from "date-fns";

interface MessageDetail {
  id: string;
  content: string;
  revealAt: string;
  isUnlocked: boolean;
  isOwner: boolean;
  isPublic: boolean;
  author: string;
  authorImage: string | null;
  reflection?: { content: string; createdAt: string } | null;
}

export default function MessageDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { data: session } = useSession();
  const [message, setMessage] = useState<MessageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reflection, setReflection] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/messages/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => {
          setMessage(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflection) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/messages/${id}/reflection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: reflection }),
      });
      if (res.ok) {
        const newReflection = await res.json();
        setMessage((prev) => prev ? { ...prev, reflection: newReflection } : null);
        setReflection("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!message) {
    return <div className="text-center text-red-500 mt-12">Message not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{message.isUnlocked ? "Message Unlocked" : "Message Locked"}</h1>
        <p className="text-gray-400 text-sm">
          From {message.author} • Unlocks on {format(new Date(message.revealAt), "MMMM d, yyyy h:mm a")}
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden shadow-2xl">
        <CardContent className="p-8 min-h-[300px] flex items-center justify-center">
          {message.isUnlocked ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-lg leading-relaxed whitespace-pre-wrap font-serif text-gray-200 w-full"
            >
              {message.content}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center space-y-6 text-gray-500">
              <Lock className="w-16 h-16 text-zinc-700 animate-pulse" />
              <div className="text-center space-y-2">
                <p className="text-2xl font-mono font-bold text-white">
                  {formatDistanceToNow(new Date(message.revealAt))} remaining
                </p>
                <p className="text-sm max-w-xs text-gray-500 mx-auto">
                  This time capsule is sealed. Patience is the key.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        {/* Cinematic lighting effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
      </Card>

      {message.isUnlocked && message.isOwner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6 pt-8 border-t border-zinc-800"
        >
          <h2 className="text-2xl font-bold">Reflection</h2>
          {message.reflection ? (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <p className="text-gray-300 italic text-lg">"{message.reflection.content}"</p>
                <p className="text-xs text-gray-500 mt-4">
                  Reflected on {format(new Date(message.reflection.createdAt), "MMM d, yyyy")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleReflection} className="space-y-4">
              <p className="text-gray-400 text-sm">How do you feel reading this now? Capture your thoughts.</p>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="w-full h-32 bg-black border border-zinc-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="Write your reflection..."
              />
              <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                {submitting ? "Saving..." : "Save Reflection"}
              </Button>
            </form>
          )}
        </motion.div>
      )}
    </div>
  );
}
