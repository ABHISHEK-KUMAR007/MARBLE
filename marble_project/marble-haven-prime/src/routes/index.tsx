import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Award, Globe2, Sparkles, Truck, ShieldCheck, Users, Star, Quote } from "lucide-react";
import hero1 from "@/assets/m5.jpeg";
import hero2 from "@/assets/m6.jpeg";
import hero3 from "@/assets/m7.jpeg";
import hero4 from "@/assets/m2.jpeg";
import hero5 from "@/assets/m4.jpeg";
import hero6 from "@/assets/m1.jpeg";
import hero7 from "@/assets/m3.jpeg";
import hero8 from "@/assets/m9.jpeg";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { applications, brands } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Makrana Marble Art | Premium Makrana Marble Manufacturer & Supplier" },
      { name: "description", content: "Makrana Marble Art is a trusted manufacturer and supplier of authentic Makrana Marble, Vietnam Marble, Marble Temples, Marble Jali, CNC Marble Carving, Marble Fountains, and custom marble solutions across India." },
      { property: "og:title", content: "Makrana Marble Art | Premium Makrana Marble Manufacturer & Supplier" },
      { property: "og:description", content: "Makrana Marble Art is a trusted manufacturer and supplier of authentic Makrana Marble, Vietnam Marble, Marble Temples, Marble Jali, CNC Marble Carving, Marble Fountains, and custom marble solutions across India." },
      { property: "og:image", content: hero1 },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const slides = [
  { image: hero1, eyebrow: "Premium Makrana Marble", title: "Premium Makrana Marble\nCrafted for Timeless Elegance", subtitle: "Transforming natural stone into architectural masterpieces with authentic Makrana marble, expert craftsmanship, and custom marble solutions for homes, temples, hotels, villas, mosques, and commercial projects across India." },
  { image: hero2, eyebrow: "Expert Craftsmanship", title: "Premium Makrana Marble\nCrafted for Timeless Elegance", subtitle: "Transforming natural stone into architectural masterpieces with authentic Makrana marble, expert craftsmanship, and custom marble solutions for homes, temples, hotels, villas, mosques, and commercial projects across India." },
  { image: hero3, eyebrow: "Custom Marble Solutions", title: "Premium Makrana Marble\nCrafted for Timeless Elegance", subtitle: "Transforming natural stone into architectural masterpieces with authentic Makrana marble, expert craftsmanship, and custom marble solutions for homes, temples, hotels, villas, mosques, and commercial projects across India." },
  { image: hero4, eyebrow: "Custom Marble Solutions", title: "Premium Makrana Marble\nCrafted for Timeless Elegance", subtitle: "Transforming natural stone into architectural masterpieces with authentic Makrana marble, expert craftsmanship, and custom marble solutions for homes, temples, hotels, villas, mosques, and commercial projects across India." },
  { image: hero5, eyebrow: "Custom Marble Solutions", title: "Premium Makrana Marble\nCrafted for Timeless Elegance", subtitle: "Transforming natural stone into architectural masterpieces with authentic Makrana marble, expert craftsmanship, and custom marble solutions for homes, temples, hotels, villas, mosques, and commercial projects across India." },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative h-[92vh] min-h-[620px] w-full overflow-hidden">
      {slides.map((s, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}>
          <img src={s.image || undefined} alt="" className="h-full w-full object-cover animate-ken-burns" />
          <div className="absolute inset-0 marble-vignette" />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      ))}

      <div className="relative z-10 h-full container-luxe flex items-end pb-20 md:pb-28">
        <div className="w-full text-white animate-rise">
          <p className="eyebrow !text-accent">{slides[i].eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl lg:text-8xl leading-[1.02] whitespace-pre-line text-balance">
            {slides[i].title}
          </h1>
          <p className="mt-6 text-white/80 text-[clamp(1.02rem,0.24vw+0.95rem,1.16rem)] leading-7">{slides[i].subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-none bg-accent text-primary hover:bg-accent/90 h-12 px-7">
              <Link to="/products">Explore Collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none h-12 px-7 bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-[3px] transition-all ${idx === i ? "w-10 bg-accent" : "w-6 bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-luxe grid gap-12 md:grid-cols-2 md:gap-20 items-center">
        <div>
          <p className="eyebrow">About Makrana Marble Art</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
            Crafting Timeless Elegance in Natural Stone
          </h2>
        </div>
        <div>
          <p className="text-muted-foreground leading-relaxed text-[clamp(1.02rem,0.24vw+0.95rem,1.16rem)]">
            Welcome to Makrana Marble Art, where the timeless beauty of authentic Makrana marble meets exceptional craftsmanship. Based in the historic marble city of Makrana, Rajasthan, we specialize in manufacturing and supplying premium-quality marble products that combine elegance, durability, and traditional artistry. With skilled artisans and years of expertise, we create custom marble solutions for homes, temples, mosques, hotels, villas, commercial spaces, and architectural projects. Every product is crafted with precision using genuine Makrana marble, renowned worldwide for its purity, strength, and for being the same heritage stone used in the Taj Mahal.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {[["100%","Authentic"],["Premium","Quality"],["Expert","Artisans"]].map(([n,l]) => (
              <div key={l}>
                <p className="font-display text-3xl md:text-4xl">{n}</p>
                <p className="text-[clamp(0.8rem,0.18vw+0.74rem,0.9rem)] uppercase tracking-widest text-muted-foreground mt-1">{l}</p>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-10 rounded-none h-11 px-6">
            <Link to="/about">Our Story <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const ourProducts = [
  { id: "makrana-white-marble", name: "Makrana White Marble", description: "Authentic & Pure", image: hero1 },
  { id: "vietnam-white-marble", name: "Vietnam White Marble", description: "Flawless White", image: hero2 },
  { id: "marble-jali", name: "Marble Jali (Jaali)", description: "Intricate Designs", image: hero3 },
  { id: "marble-pillars", name: "Marble Pillars", description: "Structural Elegance", image: hero4 },
  { id: "marble-mihrab", name: "Marble Mihrab & Qibla Designs", description: "Sacred Artistry", image: hero5 },
  { id: "marble-temples", name: "Marble Temples", description: "Divine Craftsmanship", image: hero6 },
  { id: "marble-fountains", name: "Marble Fountains", description: "Exquisite Water Features", image: hero7 },
  { id: "marble-handicrafts", name: "Marble Handicrafts", description: "Traditional Masterpieces", image: hero8 }

];

function Categories() {
  return (
    <section className="py-20 md:py-28 bg-secondary/60">
      <div className="container-luxe">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <SectionHeading eyebrow="Our Products" title="Our Premium Marble Collection" subtitle="Displaying our finest selection of Makrana marble, custom carving, and natural stone solutions." />
          <Link to="/products" className="text-[clamp(0.92rem,0.22vw+0.86rem,1.02rem)] hover:text-accent inline-flex items-center gap-1">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 xl:gap-6">
          {ourProducts.map((c) => (
            <Link key={c.id} to="/products" className="group relative aspect-[3/4] overflow-hidden bg-muted hover-lift">
              <img src={c.image || undefined} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-2xl text-white">{c.name}</h3>
                <p className="mt-1 text-sm text-white/70">{c.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[clamp(0.8rem,0.18vw+0.74rem,0.9rem)] uppercase tracking-widest text-accent">View products <ArrowRight className="h-3 w-3" /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Featured() {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: api.getProducts });
  const featured = products.filter((p: any) => p.featured);
  return (
    <section className="py-20 md:py-28">
      <div className="container-luxe">
        <SectionHeading eyebrow="Featured" title="Signature stones" subtitle="Handpicked pieces our design team keeps returning to." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-8 xl:gap-12">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

const WHY = [
  { icon: ShieldCheck, title: "Premium Quality", text: "100% Premium Quality Marble." },
  { icon: Users, title: "Custom Designs", text: "Custom Designs as per Client Requirements." },
  { icon: Sparkles, title: "Expert Carving", text: "Expert Handcrafted Marble Carving." },
  { icon: Award, title: "Factory Prices", text: "Competitive Factory Prices." },
  { icon: Truck, title: "Timely Delivery", text: "Timely Delivery Across India." },
  { icon: Globe2, title: "Trusted Service", text: "Reliable Customer Support & Trusted Quality." },
];

function WhyUs() {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground">
      <div className="container-luxe">
        <SectionHeading eyebrow="Why Choose Us" title="Why Choose Makrana Marble Art" align="center" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px bg-white/10 border border-white/10">
          {WHY.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-primary p-8 hover:bg-primary/70 transition group">
              <Icon className="h-8 w-8 text-accent group-hover:scale-110 transition-transform" />
              <h3 className="mt-6 font-display text-2xl">{title}</h3>
              <p className="mt-2 text-[clamp(0.92rem,0.22vw+0.86rem,1.02rem)] text-primary-foreground/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Arrivals() {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: api.getProducts });
  const arr = products.filter((p: any) => p.isNew);
  return (
    <section className="py-20 md:py-28">
      <div className="container-luxe">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <SectionHeading eyebrow="Latest Arrivals" title="Just landed at the yard." />
          <Link to="/products" className="text-[clamp(0.92rem,0.22vw+0.86rem,1.02rem)] hover:text-accent inline-flex items-center gap-1">All products <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 xl:gap-10">
          {arr.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

function Applications() {
  return (
    <section className="py-20 md:py-28 bg-secondary/60">
      <div className="container-luxe">
        <SectionHeading eyebrow="Applications" title="Where our stone lives." subtitle="From private residences to five-star hospitality — natural stone belongs anywhere beautiful things happen." />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {applications.map((a) => (
            <div key={a.name} className="relative aspect-[4/3] overflow-hidden group">
              <img src={a.image || undefined} alt={a.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition" />
              <h3 className="absolute inset-0 grid place-items-center font-display text-3xl md:text-4xl text-white">{a.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { data: testimonials = [] } = useQuery({ queryKey: ["testimonials"], queryFn: api.getTestimonials });
  const [i, setI] = useState(0);
  
  if (!testimonials.length) return null;
  const t = testimonials[i];
  return (
    <section className="py-20 md:py-28">
      <div className="container-luxe w-full text-center">
        <Quote className="mx-auto h-10 w-10 text-accent" />
        <blockquote className="mt-8 font-display text-2xl md:text-4xl leading-tight text-balance">"{t.quote}"</blockquote>
        <div className="mt-8 flex justify-center gap-1">
          {Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="h-4 w-4 fill-accent text-accent" />)}
        </div>
<p className="mt-4 font-medium">{t.name || t.customerName}</p>
        <p className="text-[clamp(0.92rem,0.22vw+0.86rem,1.02rem)] text-muted-foreground">{t.role || t.location}</p>
        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Testimonial ${k+1}`} className={`h-[3px] transition-all ${k === i ? "w-8 bg-primary" : "w-4 bg-border"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Brands() {
  const row = [...brands, ...brands];
  return (
    <section className="py-14 border-y border-border overflow-hidden">
      <div className="flex animate-marquee gap-16 whitespace-nowrap">
        {row.map((b, i) => (
          <span key={i} className="font-display text-2xl tracking-[0.3em] text-muted-foreground/70">{b}</span>
        ))}
      </div>
    </section>
  );
}

function Blogs() {
  const { data: posts = [] } = useQuery({ queryKey: ["blogs"], queryFn: api.getBlogs });
  return (
    <section className="py-20 md:py-28">
      <div className="container-luxe">
        <SectionHeading eyebrow="Journal" title="Ideas from the studio." />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {posts.map((p) => (
            <Link key={p.id} to="/blog" className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img src={p.image || undefined} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
              </div>
<p className="eyebrow !text-muted-foreground mt-4">{p.date || p.publishedAt || 'Draft'}</p>
              <h3 className="mt-2 font-display text-2xl group-hover:text-accent transition">{p.title}</h3>
              <p className="mt-2 text-[clamp(0.92rem,0.22vw+0.86rem,1.02rem)] text-muted-foreground">{p.excerpt || p.content?.substring(0, 100) + '...'}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden">
      <img src={hero3 || undefined} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative container-luxe py-24 md:py-32 text-center text-white">
        <p className="eyebrow !text-accent">Bring your project to life</p>
        <h2 className="mt-4 font-display text-4xl md:text-6xl text-balance mx-auto">Let's specify the perfect stone together.</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-none bg-accent text-primary hover:bg-accent/90 h-12 px-7">
            <Link to="/contact">Request a Quote</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-none h-12 px-7 bg-transparent border-white text-white hover:bg-white hover:text-primary">
            <a href="tel:+917378260294">Call Now</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Categories />
      <Featured />
      <WhyUs />
      <Arrivals />
      <Applications />
      <Testimonials />
      <Brands />
      <Blogs />
      <CTA />
    </>
  );
}
