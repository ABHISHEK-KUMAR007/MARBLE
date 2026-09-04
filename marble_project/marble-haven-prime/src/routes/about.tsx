import { createFileRoute } from "@tanstack/react-router";
import hero2 from "@/assets/hero-marble-2.jpg";
import hero3 from "@/assets/hero-marble-3.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Makrana Marble Art" },
      { name: "description", content: "Makrana Marble Art: Crafting Timeless Elegance in Natural Stone." },
      { property: "og:title", content: "About — Makrana Marble Art" },
      { property: "og:description", content: "Crafting Timeless Elegance in Natural Stone." },
      { property: "og:image", content: hero2 },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const CERTIFICATES = ["ISO 9001:2015", "ISO 14001", "CE Marking", "Green Guard", "SGS Verified", "Star Export House"];

function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="container-luxe grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="eyebrow">About Makrana Marble Art</p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl leading-[1.05] text-balance">Crafting Timeless Elegance in Natural Stone.</h1>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Welcome to Makrana Marble Art, where the timeless beauty of authentic Makrana marble meets exceptional craftsmanship. Based in the historic marble city of Makrana, Rajasthan, we specialize in manufacturing and supplying premium-quality marble products that combine elegance, durability, and traditional artistry. With skilled artisans and years of expertise, we create custom marble solutions for homes, temples, mosques, hotels, villas, commercial spaces, and architectural projects. Every product is crafted with precision using genuine Makrana marble, renowned worldwide for its purity, strength, and for being the same heritage stone used in the Taj Mahal.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <img src={hero2} alt="Marble craftsmanship" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/60">
        <div className="container-luxe grid md:grid-cols-2 gap-10">
          {[
            { t: "Our Vision", p: "To become one of India's most trusted marble brands, recognized globally for quality, craftsmanship, and excellence in natural stone solutions." },
            { t: "Our Mission", p: "To preserve the rich heritage of Makrana marble while delivering world-class craftsmanship, innovative designs, and complete customer satisfaction." },
          ].map((b) => (
            <div key={b.t} className="bg-background p-10 border border-border">
              <p className="eyebrow">{b.t}</p>
              <p className="mt-4 font-display text-2xl leading-tight">{b.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container-luxe">
          <p className="eyebrow">Infrastructure</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Built for scale, tuned for craft.</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {[["300,000 sq ft","Manufacturing facility"],["24 gangsaw","& block cutter lines"],["3,000+ slabs","Weekly capacity"]].map(([n,l]) => (
              <div key={l} className="border-t border-border pt-6">
                <p className="font-display text-4xl">{n}</p>
                <p className="mt-2 text-sm text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            <img src={hero3} alt="Factory" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            <img src={hero2} alt="Yard" className="w-full aspect-[4/3] object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-luxe">
          <p className="eyebrow !text-accent">Certifications</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Certified. Compliant. Consistent.</h2>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-px bg-white/10">
            {CERTIFICATES.map((c) => (
              <div key={c} className="bg-primary p-8 text-center font-display text-xl">{c}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
