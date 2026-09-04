import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Download, MessageCircle, Phone, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductCard } from "@/components/site/ProductCard";
import { ImageLightbox } from "@/components/site/ImageLightbox";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  loader: async ({ params }) => {
    try {
      const product = await api.getProduct(params.id);
      if (!product) throw notFound();
      return { product };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found" }, { name: "robots", content: "noindex" }] };
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — Aureo Stone` },
        { name: "description", content: product.description },
        { property: "og:title", content: `${product.name} — Aureo Stone` },
        { property: "og:description", content: product.description },
        { property: "og:image", content: product.image },
        { property: "og:url", content: `/products/${product.id}` },
      ],
      links: [{ rel: "canonical", href: `/products/${product.id}` }],
    };
  },
  notFoundComponent: () => (
    <div className="pt-32 pb-24 container-luxe text-center">
      <h1 className="font-display text-4xl">Product not found</h1>
      <Link to="/products" className="mt-4 inline-block text-accent">Back to products</Link>
    </div>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const [img, setImg] = useState(product.images?.[0]?.url || product.image);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const gallery = product.images?.length > 0 ? product.images.map((img: any) => img.url) : [product.image];

  const { data: allProducts = [] } = useQuery({ queryKey: ["products"], queryFn: api.getProducts });
  const related = allProducts.filter((p: any) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const [loading, setLoading] = useState(false);

  const openViewer = (index: number) => {
    if (gallery.length === 0) return;
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      customerName: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      city: formData.get("city"),
      message: formData.get("message"),
      interestedProduct: product.name,
    };
    try {
      await api.postInquiry(data);
      toast.success("Thank you! Your inquiry has been submitted successfully. Our team will contact you soon.");
      form.reset();
    } catch (err: any) {
      toast.error(err.message || "Unable to submit your inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="pt-28 pb-16">
        <div className="container-luxe">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to products
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24">
            <div>
              <button type="button" onClick={() => openViewer(gallery.indexOf(img))} className="relative block w-full overflow-hidden bg-muted group text-left">
                <div className="relative aspect-square overflow-hidden">
                  <img src={img} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </button>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((g, i) => (
                  <button key={i} type="button" onClick={() => { setImg(g); openViewer(i); }} className={`aspect-square overflow-hidden bg-muted border-2 ${img === g ? "border-accent" : "border-transparent"}`}>
                    <img src={g} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow">{product.category}</p>
              <h1 className="mt-3 font-display text-4xl md:text-6xl">{product.name}</h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

              <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-border py-6">
                {[["Origin", product.origin],["Finish", product.finish],["Thickness", product.thickness],["Price", product.price ? `$${product.price}` : "On request"]].map(([k,v]) => (
                  <div key={k}>
                    <dt className="eyebrow !text-muted-foreground">{k}</dt>
                    <dd className="mt-1 font-display text-xl">{v || "N/A"}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button className="rounded-none h-12 bg-primary text-primary-foreground">Request Quote</Button>
                <Button variant="outline" className="rounded-none h-12" asChild>
                  <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Inquiry</a>
                </Button>
                <Button variant="outline" className="rounded-none h-12" asChild>
                  <a href="tel:+919999999999"><Phone className="mr-2 h-4 w-4" /> Call Now</a>
                </Button>
                <Button variant="ghost" className="rounded-none h-12"><Download className="mr-2 h-4 w-4" /> Download Brochure</Button>
              </div>

              <div className="mt-8 pt-8 border-t">
                <p className="eyebrow">Applications</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Flooring","Walls","Kitchen","Bathroom","Hospitality","Facades"].map((t) => (
                    <span key={t} className="text-xs uppercase tracking-widest px-3 py-1.5 border border-border">{t}</span>
                  ))}
                </div>
              </div>

              <button className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Share2 className="h-4 w-4" /> Share this product
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/50">
        <div className="container-luxe grid lg:grid-cols-2 gap-12 xl:gap-24">
          <div>
            <p className="eyebrow">Inquire</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">Send an inquiry about {product.name}</h2>
            <p className="mt-3 text-muted-foreground">Our team responds within one business day.</p>
          </div>
          <form
            onSubmit={handleInquirySubmit}
            className="grid grid-cols-2 gap-4"
          >
            <Input required name="name" placeholder="Full name" className="rounded-none col-span-2 sm:col-span-1" />
            <Input required type="tel" name="phone" placeholder="Phone" className="rounded-none col-span-2 sm:col-span-1" />
            <Input required type="email" name="email" placeholder="Email" className="rounded-none col-span-2 sm:col-span-1" />
            <Input name="city" placeholder="City" className="rounded-none col-span-2 sm:col-span-1" />
            <Textarea required name="message" placeholder="Tell us about your project" rows={4} className="rounded-none col-span-2" />
            <Button type="submit" disabled={loading} className="rounded-none col-span-2 h-12 bg-primary text-primary-foreground">
              {loading ? "Submitting..." : "Send Inquiry"}
            </Button>
          </form>
        </div>
      </section>

      <ImageLightbox
        isOpen={viewerOpen}
        images={gallery}
        initialIndex={viewerIndex}
        onClose={() => setViewerOpen(false)}
        title={product.name}
      />

      {related.length > 0 && (
        <section className="py-20">
          <div className="container-luxe">
            <h2 className="font-display text-3xl md:text-4xl mb-10">Related products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 xl:gap-12">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
