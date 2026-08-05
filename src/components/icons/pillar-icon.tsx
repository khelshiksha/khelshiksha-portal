import {
  BookOpen,
  Compass,
  HeartPulse,
  Leaf,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pillar icons.
 *
 * These are Lucide stand-ins. Lucide has no honest glyph for "Foundational
 * Literacy & Numeracy" or "Future Readiness", so five bespoke line icons in
 * the same stroke language are a small illustration commission - tracked in
 * the design system doc. Swapping them is a change to this map only.
 */
const ICONS: Record<string, LucideIcon> = {
  fln: BookOpen,
  health: HeartPulse,
  climate: Leaf,
  future: Compass,
  life: ShieldCheck,
};

export function PillarIcon({
  name,
  className,
  size = 30,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Icon = ICONS[name] ?? BookOpen;
  return (
    <Icon
      size={size}
      strokeWidth={1.75}
      aria-hidden="true"
      className={cn(className)}
    />
  );
}
