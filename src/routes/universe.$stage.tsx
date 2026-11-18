import { createFileRoute, Navigate, notFound, useNavigate } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { FinaleStage } from "@/components/stages/FinaleStage";
import { GiftsStage } from "@/components/stages/GiftsStage";
import { HuntStage } from "@/components/stages/HuntStage";
import { LettersStage } from "@/components/stages/LettersStage";
import { PlayStage } from "@/components/stages/PlayStage";
import { StarsStage } from "@/components/stages/StarsStage";
import { TimelineStage } from "@/components/stages/TimelineStage";
import { WelcomeStage } from "@/components/stages/WelcomeStage";
import { isStageId, isStageUnlocked, type StageId } from "@/lib/progress-rules";
import { useProgress } from "@/lib/progress-store";
import { useSceneMode } from "@/lib/scene-store";
import { STAGE_META } from "@/lib/stages";

export type StageProps = { onComplete: () => void; done: boolean };

const STAGES: Record<StageId, ComponentType<StageProps>> = {
  welcome: WelcomeStage,
  timeline: TimelineStage,
  stars: StarsStage,
  play: PlayStage,
  hunt: HuntStage,
  gifts: GiftsStage,
  letters: LettersStage,
  finale: FinaleStage,
};

export const Route = createFileRoute("/universe/$stage")({
  beforeLoad: ({ params }) => {
    if (!isStageId(params.stage)) throw notFound();
  },
  head: ({ params }) => {
    const name = isStageId(params.stage) ? STAGE_META[params.stage].name : "كوكب";
    return {
      meta: [
        { title: `${name} — A Universe Called Jana` },
        { name: "description", content: `${name}: محطة من رحلة جنى في الكون بتاعها.` },
        { property: "og:title", content: `${name} — A Universe Called Jana` },
        { property: "og:description", content: "محطة من رحلة جنى في الكون بتاعها." },
      ],
    };
  },
  component: StagePage,
});

function StagePage() {
  const { stage } = Route.useParams();
  const id = stage as StageId;
  useSceneMode(id === "finale" ? "finale" : "stage");
  const navigate = useNavigate();
  const completed = useProgress((s) => s.completed);
  const completeStage = useProgress((s) => s.completeStage);
  if (!isStageUnlocked(id, completed)) return <Navigate to="/universe" />;
  const Stage = STAGES[id];
  const done = completed.includes(id);
  return (
    <Stage
      key={id}
      done={done}
      onComplete={() => {
        completeStage(id);
        navigate({ to: "/universe" });
      }}
    />
  );
}
