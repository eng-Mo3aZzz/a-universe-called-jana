export type Photo = { image: string | null; caption: string };

export type TimelineCard = { id: string; date: string; title: string; text: string; image: string | null; imageLabel: string };

export type StarItem = { id: string; kind: "message" | "memory" | "photo" | "note"; title: string; text: string; image: string | null };

export type Question = { id: string; question: string; options: { label: string; response: string }[] };

export type Stat = { label: string; kind: "percent" | "danger" | "counting" | "infinite"; value: string; percent?: number };

export type HuntStep = { id: string; clue: string; question: string; hints: string[]; answers: string[]; success: string };

type GiftBase = { id: string; title: string; teaser: string };
export type Gift =
  | (GiftBase & { type: "letter"; greeting: string; body: string; signature: string })
  | (GiftBase & { type: "gallery"; photos: Photo[] })
  | (GiftBase & { type: "music"; note: string; tracks: number[] })
  | (GiftBase & { type: "memories"; cards: { front: string; back: string }[] })
  | (GiftBase & { type: "surprise"; heading: string; body: string; image: string | null });

export type SealedLetter = {
  id: string;
  title: string;
  forLabel: string;
  /** ISO date. null = can be opened any time. */
  opensAt: string | null;
  greeting: string;
  body: string;
  signature: string;
};

export type UniverseContentSource = {
  herName: string;
  herNameEn: string;
  partnerName: string;
  relationshipStart: string;
  welcome: { eyebrow: string; title: string; message: string; wishPrompt: string; wishDone: string; startButton: string };
  timeline: { intro: string; cards: TimelineCard[] };
  stars: { intro: string; items: StarItem[] };
  play: { intro: string; questions: Question[]; statsTitle: string; stats: Stat[] };
  hunt: { intro: string; steps: HuntStep[]; finalMessage: string };
  gifts: { intro: string; items: Gift[] };
  letters: { intro: string; items: SealedLetter[] };
  playlist: { title: string; artist: string; src: string }[];
  finale: {
    lines: string[];
    media: { type: "image" | "video"; src: string | null; label: string };
    voice: { src: string | null; label: string };
    finalMessage: string;
    signature: string;
  };
  secrets: { id: string; text: string }[];
};

export type ClientLetter = Omit<SealedLetter, "greeting" | "body" | "signature"> & {
  sealed: boolean;
  greeting: string | null;
  body: string | null;
  signature: string | null;
};

export type UniverseContent = Omit<UniverseContentSource, "letters"> & {
  letters: { intro: string; items: ClientLetter[] };
};
