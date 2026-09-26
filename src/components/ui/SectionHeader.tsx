type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  invert?: boolean;
};

export default function SectionHeader({ eyebrow, title, subtitle, align = "center", invert = false }: Props) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${invert ? "text-primary-foreground" : ""}`}>
      {eyebrow && (
        <p className={`eyebrow ${invert ? "!text-accent" : ""}`}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-4 font-display font-bold text-3xl sm:text-4xl md:text-5xl text-balance leading-[1.05] ${invert ? "text-primary-foreground" : "text-primary-deep"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${invert ? "text-primary-foreground/75" : "text-muted-foreground"}`}
        >
          {subtitle}
        </p>
      )}
      {align === "center" && <div className="gold-divider mx-auto mt-6" />}
    </div>
  );
}
