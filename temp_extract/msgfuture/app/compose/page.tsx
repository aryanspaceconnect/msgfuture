"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader2, Send } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Compose() {
  const router = useRouter();
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [revealDate, setRevealDate] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !revealDate) return;

    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          revealAt: new Date(revealDate).toISOString(),
          isPublic,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="text-gray-400 mb-8">You need to sign in to write a message to your future self.</p>
        <Button onClick={() => router.push("/api/auth/signin")}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
        Write to the Future
      </h1>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Your Message</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[200px] bg-black border border-zinc-700 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
                placeholder="Dear Future Me..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Unlock Date</label>
                <Input
                  type="datetime-local"
                  value={revealDate}
                  onChange={(e) => setRevealDate(e.target.value)}
                  className="bg-black border-zinc-700 text-white"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 pt-8">
                <input
                  type="checkbox"
                  id="public"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 bg-black text-white focus:ring-white/20"
                />
                <label htmlFor="public" className="text-sm text-gray-300 cursor-pointer select-none">
                  Make public after unlocking (Echo Wall)
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-bold bg-white text-black hover:bg-gray-200 transition-colors rounded-full mt-8"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send to Future <Send className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
