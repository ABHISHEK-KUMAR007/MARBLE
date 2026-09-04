export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[clamp(0.78rem,0.18vw+0.74rem,0.9rem)] uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
        <h1 className="mt-1 font-display text-[clamp(1.8rem,0.8vw+1.45rem,2.6rem)] md:text-[clamp(2.2rem,0.9vw+1.8rem,3rem)]">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-[clamp(0.92rem,0.22vw+0.86rem,1.02rem)] text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
