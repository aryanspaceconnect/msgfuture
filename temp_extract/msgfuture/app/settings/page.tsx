"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import Image from "next/image";

export default function Settings() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [avatarSeed, setAvatarSeed] = useState(session?.user?.email || "default");
  const [loading, setLoading] = useState(false);

  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarSeed}`;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: avatarUrl }),
      });

      if (res.ok) {
        await update({ name, image: avatarUrl });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-8 space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-zinc-700">
              <Image src={avatarUrl} alt="Avatar" layout="fill" objectFit="cover" />
            </div>
            <Button
              variant="outline"
              onClick={() => setAvatarSeed(Math.random().toString(36).substring(7))}
              className="text-xs"
            >
              Randomize Avatar
            </Button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Display Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black border-zinc-700 text-white"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
