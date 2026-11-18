import { create } from "zustand";

export type Track = { title: string; artist: string; src: string };

type PlayerState = {
  tracks: Track[];
  index: number;
  playing: boolean;
  volume: number;
  current: number;
  duration: number;
  open: boolean;
  setTracks: (tracks: Track[]) => void;
  playIndex: (i: number) => void;
  toggle: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
  setVolume: (v: number) => void;
  setOpen: (open: boolean) => void;
};

let audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = "metadata";
  audio.addEventListener("timeupdate", () => usePlayer.setState({ current: audio!.currentTime }));
  audio.addEventListener("loadedmetadata", () => usePlayer.setState({ duration: audio!.duration || 0 }));
  audio.addEventListener("play", () => usePlayer.setState({ playing: true }));
  audio.addEventListener("pause", () => usePlayer.setState({ playing: false }));
  audio.addEventListener("ended", () => usePlayer.getState().next());
  return audio;
}

export const usePlayer = create<PlayerState>()((set, get) => ({
  tracks: [],
  index: 0,
  playing: false,
  volume: 0.7,
  current: 0,
  duration: 0,
  open: false,
  setTracks: (tracks) => set({ tracks }),
  playIndex: (i) => {
    const { tracks, volume } = get();
    const track = tracks[i];
    if (!track) return;
    const a = getAudio();
    const url = new URL(track.src, window.location.href).href;
    if (a.src !== url) {
      a.src = url;
      set({ current: 0, duration: 0 });
    }
    a.volume = volume;
    set({ index: i });
    void a.play().catch(() => set({ playing: false }));
  },
  toggle: () => {
    const a = getAudio();
    if (!a.src) return get().playIndex(get().index);
    if (a.paused) void a.play().catch(() => undefined);
    else a.pause();
  },
  pause: () => audio?.pause(),
  next: () => {
    const { tracks, index } = get();
    if (tracks.length) get().playIndex((index + 1) % tracks.length);
  },
  prev: () => {
    const { tracks, index } = get();
    if (!tracks.length) return;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    get().playIndex((index - 1 + tracks.length) % tracks.length);
  },
  seek: (t) => {
    if (audio && Number.isFinite(t)) audio.currentTime = t;
  },
  setVolume: (v) => {
    set({ volume: v });
    if (audio) audio.volume = v;
  },
  setOpen: (open) => set({ open }),
}));
