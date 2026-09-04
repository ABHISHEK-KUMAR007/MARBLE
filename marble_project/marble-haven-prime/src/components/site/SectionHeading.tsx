import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  return (
    <div className={`mb-10 md:mb-14 ${align === "center" ? "mx-auto w-full text-center" : "w-full"}`}>
      {eyebrow && <p className="eyebrow text-[clamp(0.86rem,0.2vw+0.8rem,0.98rem)]">{eyebrow}</p>}
      <h2 className="mt-3 leading-[1.05] tracking-[-0.03em] text-balance text-[clamp(2rem,0.9vw+1.55rem,2.85rem)] lg:text-[clamp(2.35rem,0.95vw+1.9rem,3.15rem)] font-semibold text-foreground">
        {title}
      </h2>
      {subtitle && <p className="mt-4 max-w-3xl text-[clamp(1rem,0.2vw+0.94rem,1.08rem)] leading-7 text-muted-foreground/95">{subtitle}</p>}
      {children}
    </div>
  );
}
