"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500"
      >
        Send a Message<br />Through Time
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-xl text-gray-400 max-w-2xl mx-auto"
      >
        Securely store your thoughts, dreams, and memories.
        Set a date. Wait. Rediscover yourself.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4"
      >
        <Link href="/compose">
          <Button className="px-8 py-6 text-lg rounded-full">
            Write to Future Self
          </Button>
        </Link>
        <Link href="/echo">
          <Button variant="outline" className="px-8 py-6 text-lg rounded-full">
            Explore Echoes
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
