"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface PublicMessage {
  id: string;
  content: string;
  revealAt: string;
  author: string;
  authorImage: string | null;
}

export default function EchoWall() {
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/messages/public")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-gray-500">Listening to echoes...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-400 to-white">
          The Echo Wall
        </h1>
        <p className="text-gray-400 text-lg">
          Voices from the past, echoing into the present.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900 transition-colors group">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  {msg.authorImage ? (
                    <Image
                      src={msg.authorImage}
                      alt={msg.author}
                      width={32}
                      height={32}
                      className="rounded-full border border-gray-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                      ?
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-300">{msg.author}</p>
                    <p className="text-xs text-gray-500">
                      Wrote this {formatDistanceToNow(new Date(msg.revealAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <p className="text-lg text-gray-200 font-serif leading-relaxed">
                  "{msg.content}"
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
