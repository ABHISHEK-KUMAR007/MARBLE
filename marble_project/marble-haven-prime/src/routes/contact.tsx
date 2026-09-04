import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      {
        title: "Contact — Makrana Marble Art",
      },
      {
        name: "description",
        content:
          "Contact Makrana Marble Art for premium marble, granite and natural stone inquiries.",
      },
      {
        property: "og:title",
        content: "Contact — Makrana Marble Art",
      },
      {
        property: "og:description",
        content:
          "Get in touch with Makrana Marble Art for marble supply and export inquiries.",
      },
      {
        property: "og:url",
        content: "/contact",
      },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<any>({});

  useEffect(() => {
    api.getCompanyProfile().then(setCompany).catch(() => setCompany({}));
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      customerName: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      city: formData.get("city"),
      message: formData.get("message"),
      interestedProduct:
        formData.get("product") || "General Inquiry",
    };

    try {
      await api.postInquiry(data);

      toast.success(
        "Thank you! Your inquiry has been sent successfully."
      );

      form.reset();
    } catch (err: any) {
      toast.error(
        err.message ||
          "Unable to send your inquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const companyName = company?.companyName || "Makrana Marble Art";
  const phoneLines = [company?.phone, company?.alternatePhone].filter(Boolean);
  const email = company?.email || "makranamarblearts@gmail.com";
  const addressLines = (company?.address || "Bhatipura, Ratanpura,\nMakrana, Rajasthan 341505,\nIndia").split(/\n|,\s*\n|\s*,\s*/).filter(Boolean).slice(0, 3);
  const businessHours = company?.businessHours || "Monday – Saturday\n09:00 AM – 07:00 PM";
  const mapSource = company?.googleMapsEmbed || "https://www.google.com/maps?q=Makrana%20Rajasthan%20341505&output=embed";
  const whatsappNumber = company?.whatsapp || "+91 7378260294";

 return (
  <>
    {/* Hero */}
    <section className="border-b bg-secondary/40 pt-32 pb-14">
      <div className="container-luxe">
        <p className="eyebrow">Get In Touch</p>

        <h1 className="mt-3 font-display text-5xl md:text-6xl">
          Contact Us
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          We'd love to hear from you. Contact us for marble selection,
          pricing, export inquiries, custom orders and project
          consultation.
        </p>
      </div>
    </section>

    <section className="py-20">
      <div className="container-luxe space-y-16">

        {/* Top Row */}
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr]">

          {/* Contact Information */}
          <aside className="rounded-xl border border-border bg-secondary/40 p-8 shadow-sm lg:p-10">

            <h2 className="mb-8 font-display text-3xl">
              Contact Information
            </h2>

            <div className="space-y-8">
              {[
                {
                  Icon: MapPin,
                  title: "Visit Us",
                  lines: addressLines,
                },
                {
                  Icon: Phone,
                  title: "Call Us",
                  lines: phoneLines,
                },
                {
                  Icon: Mail,
                  title: "Email",
                  lines: [email],
                },
                {
                  Icon: MessageCircle,
                  title: "WhatsApp",
                  lines: [whatsappNumber],
                },
                {
                  Icon: Clock,
                  title: "Business Hours",
                  lines: businessHours.split(/\n|\s*–\s*|\s*-\s*/).filter(Boolean).slice(0, 3),
                },
              ].filter(({ lines }) => lines.length > 0).map(({ Icon, title, lines }) => (
                <div
                  key={title}
                  className="flex gap-5"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg">
                      {title}
                    </h4>

                    {lines.map((line) => (
                      <p
                        key={line}
                        className="mt-1 text-muted-foreground"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </aside>

          {/* Inquiry Form */}
          <form
  onSubmit={handleSubmit}
  className="flex h-full flex-col rounded-xl border border-border bg-secondary/40 p-8 shadow-sm lg:p-10"
>
  <h2 className="mb-8 font-display text-3xl">
    Send Inquiry
  </h2>

  <div className="grid flex-1 gap-5 md:grid-cols-2">

    <Input
      required
      name="name"
      placeholder="Full Name"
      className="h-12 w-full"
    />

    <Input
      required
      name="phone"
      type="tel"
      placeholder="Phone Number"
      className="h-12 w-full"
    />

    <Input
      required
      name="email"
      type="email"
      placeholder="Email Address"
      className="h-12 w-full"
    />

    <Input
      name="city"
      placeholder="City"
      className="h-12 w-full"
    />

    <Select name="product">
      <SelectTrigger className="h-12 w-full">
        <SelectValue placeholder="Interested Product" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="Makrana Marble">
          Makrana Marble
        </SelectItem>

        <SelectItem value="Italian Marble">
          Italian Marble
        </SelectItem>

        <SelectItem value="Granite">
          Granite
        </SelectItem>

        <SelectItem value="Sandstone">
          Sandstone
        </SelectItem>

        <SelectItem value="Marble Tiles">
          Marble Tiles
        </SelectItem>

        <SelectItem value="Custom Order">
          Custom Order
        </SelectItem>
      </SelectContent>
    </Select>

    <Select name="contactMethod">
      <SelectTrigger className="h-12 w-full">
        <SelectValue placeholder="Preferred Contact" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="Phone">
          Phone
        </SelectItem>

        <SelectItem value="Email">
          Email
        </SelectItem>

        <SelectItem value="WhatsApp">
          WhatsApp
        </SelectItem>
      </SelectContent>
    </Select>

    <Textarea
      required
      name="message"
      placeholder="Tell us about your project..."
      className="min-h-[220px] resize-none md:col-span-2"
    />

    <Button
      type="submit"
      disabled={loading}
      className="h-12 w-full md:col-span-2"
    >
      {loading ? "Sending..." : "Send Inquiry"}
    </Button>

  </div>
</form>

        </div>

        {/* Bottom Row */}
        <div className="grid gap-10 lg:grid-cols-2">

          {/* Google Map */}
          <div className="overflow-hidden rounded-xl border border-border shadow-sm h-[450px]">

            <iframe
              title={companyName + " Location"}
              src={mapSource}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

          </div>

          {/* Company Info */}
          <div className="flex h-[450px] flex-col justify-center rounded-xl border border-border bg-secondary/40 p-10 shadow-sm">

            <p className="eyebrow">
              {companyName}
            </p>

            <h2 className="mt-3 font-display text-4xl">
              Visit Our Factory & Showroom
            </h2>

            <p className="mt-6 leading-8 text-muted-foreground">
              {company?.aboutCompany || "Makrana Marble Art is one of Rajasthan's trusted suppliers of premium Makrana Marble, Italian Marble, Granite, Sandstone and custom stone products. We welcome architects, builders, dealers and homeowners to visit our showroom and manufacturing unit."}
            </p>

            <div className="mt-8 space-y-4 text-base">

              {addressLines.length > 0 && (
                <div className="flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-primary" />
                  <span>
                    {addressLines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </span>
                </div>
              )}

              {phoneLines.length > 0 && (
                <div className="flex gap-3">
                  <Phone className="mt-1 h-5 w-5 text-primary" />
                  <span>
                    {phoneLines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </span>
                </div>
              )}

              {email && (
                <div className="flex gap-3">
                  <Mail className="mt-1 h-5 w-5 text-primary" />
                  <span>{email}</span>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  </>
)
}