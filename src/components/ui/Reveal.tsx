import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Fades content in as it scrolls into view (CSS only — see `.reveal` in globals.css). */
export default function Reveal({ children, className }: Props) {
  return <div className={className ? `reveal ${className}` : "reveal"}>{children}</div>;
}
