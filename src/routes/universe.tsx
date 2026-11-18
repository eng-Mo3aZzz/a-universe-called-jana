import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { MusicPlayer } from "@/components/jana/MusicPlayer";
import { getUniverseContent } from "@/lib/gate.functions";
import { usePlayer } from "@/lib/player";
import { readToken } from "@/lib/unlock-token";

export const Route = createFileRoute("/universe")({
  // The experience is browser-only (3D, saved progress, unlock key in this device).
  ssr: false,
  loader: async () => {
    const token = readToken();
    if (!token) throw redirect({ to: "/" });
    return getUniverseContent({ data: { token } });
  },
  head: () => ({
    meta: [
      { title: "A Universe Called Jana" },
      { name: "description", content: "مجرة كاملة معمولة لجنى: كواكب، نجوم، هدايا وجوابات." },
      { property: "og:title", content: "A Universe Called Jana" },
      { property: "og:description", content: "مجرة كاملة معمولة لجنى." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  pendingComponent: () => (
    <div className="fixed inset-0 z-10 grid place-items-center">
      <p className="animate-pulse font-script text-2xl text-cream">بنجهزلك الكون...</p>
    </div>
  ),
  component: UniverseLayout,
});

function UniverseLayout() {
  const content = Route.useLoaderData();
  useEffect(() => {
    usePlayer.getState().setTracks(content.playlist);
  }, [content.playlist]);
  return (
    <>
      <Outlet />
      <MusicPlayer />
    </>
  );
}
