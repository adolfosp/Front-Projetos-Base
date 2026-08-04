import { PositionLab } from "@/components/labs/position-lab";
import type { Topic } from "@/lib/topics";

export function LabRenderer({ topic }: { topic: Topic }) {
  switch (topic.kind) {
    case "position":
      return <PositionLab />;
    default:
      return null;
  }
}
