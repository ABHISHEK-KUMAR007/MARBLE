import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import logo from "@/assets/com_logo.jpeg";
import { api } from "@/lib/api";

type CompanyProfile = {
  companyName?: string;
  phone?: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  aboutCompany?: string;

  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
};

export function Footer() {
  const [company, setCompany] =
    useState<CompanyProfile | null>(null);

  useEffect(() => {
    api
      .getCompanyProfile()
      .then((data) => {
        console.log("FOOTER COMPANY PROFILE:", data);

        setCompany(data || {});
      })
      .catch((error) => {
        console.error(
          "FOOTER COMPANY PROFILE ERROR:",
          error
        );

        setCompany({});
      });
  }, []);

  const socialLinks = useMemo(
    () => ({
      instagram: company?.instagram?.trim(),
      facebook: company?.facebook?.trim(),
      youtube: company?.youtube?.trim(),
      linkedin: company?.linkedin?.trim(),
    }),
    [company]
  );

  const socialItems = [
    {
      Icon: Instagram,
      href: socialLinks.instagram,
      label: "Instagram",
    },
    {
      Icon: Facebook,
      href: socialLinks.facebook,
      label: "Facebook",
    },
    {
      Icon: Youtube,
      href: socialLinks.youtube,
      label: "YouTube",
    },
    {
      Icon: Linkedin,
      href: socialLinks.linkedin,
      label: "LinkedIn",
    },
  ].filter(
    (item) =>
      item.href &&
      /^https?:\/\//i.test(item.href)
  );

  const companyName =
    company?.companyName ||
    "Makrana Marble Art";

  const phoneLines = [
    company?.phone,
    company?.alternatePhone,
  ].filter(Boolean);

  const email =
    company?.email ||
    "makranamarblearts@gmail.com";

  const addressLines = (
    company?.address ||
    `Bhatipura, Ratanpura,
Makrana, Rajasthan 341505,
India`
  )
    .split(/\n/)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <footer className="bg-primary text-primary-foreground">

      <div className="container-luxe grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4">

        {/* COMPANY */}
        <div>

          <div className="flex items-center gap-3">

            <img
              src={logo}
              alt={companyName}
              className="h-12 w-12 rounded-full object-cover"
            />

            <div>
              <h2 className="font-display text-[1.45rem] font-semibold leading-tight text-white">
                {companyName}
              </h2>

              <p className="text-[clamp(0.82rem,0.2vw+0.78rem,0.95rem)] uppercase tracking-[0.28em] text-accent">
                Premium Natural Stones
              </p>
            </div>

          </div>

          <p className="mt-5 text-[clamp(1rem,0.2vw+0.94rem,1.08rem)] leading-7 text-primary-foreground/75">
            GST NO.- 453679HKIU
          </p>

          <p className="mt-5 text-[clamp(1rem,0.2vw+0.94rem,1.08rem)] leading-7 text-primary-foreground/75">
            {company?.aboutCompany ||
              "Makrana Marble Art – Turning Natural Stone into Timeless Masterpieces."}
          </p>

          {/* SOCIAL MEDIA */}

          {socialItems.length > 0 && (
            <div className="mt-6 flex gap-3">

              {socialItems.map(
                ({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:border-accent hover:bg-accent hover:text-primary"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              )}

            </div>
          )}

        </div>

        {/* EXPLORE */}

        <div>
          <h4 className="eyebrow !text-accent">
            Explore
          </h4>

          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/80">

            {[
              ["/products", "Products"],
              ["/categories", "Categories"],
              ["/gallery", "Gallery"],
              ["/projects", "Projects"],
              ["/blog", "Blogs"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="transition hover:text-accent"
                >
                  {label}
                </Link>
              </li>
            ))}

          </ul>
        </div>

        {/* COMPANY */}

        <div>
          <h4 className="eyebrow !text-accent">
            Company
          </h4>

          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/80">

            {[
              ["/about", "About Us"],
              ["/contact", "Contact"],
              ["/videos", "Videos"],
              ["/contact", "Export Enquiries"],
              ["/contact", "Support"],
            ].map(([to, label], index) => (
              <li key={index}>
                <Link
                  to={to}
                  className="transition hover:text-accent"
                >
                  {label}
                </Link>
              </li>
            ))}

          </ul>
        </div>

        {/* CONTACT */}

        <div>

          <h4 className="eyebrow !text-accent">
            Stay Connected
          </h4>

          <ul className="mt-5 space-y-3 text-[clamp(1rem,0.2vw+0.94rem,1.08rem)] text-primary-foreground/85">

            {/* ADDRESS */}

            {addressLines.length > 0 && (
              <li className="flex gap-3">

                <MapPin className="mt-1 h-4 w-4 shrink-0 text-accent" />

                <span>
                  {addressLines.map(
                    (line, index) => (
                      <span
                        key={`${line}-${index}`}
                        className="block"
                      >
                        {line}
                      </span>
                    )
                  )}
                </span>

              </li>
            )}

            {/* PHONE */}

            {phoneLines.length > 0 && (
              <li className="flex gap-3">

                <Phone className="mt-1 h-4 w-4 shrink-0 text-accent" />

                <span>
                  {phoneLines.map((line) => (
                    <span
                      key={line}
                      className="block"
                    >
                      {line}
                    </span>
                  ))}
                </span>

              </li>
            )}

            {/* EMAIL */}

            {email && (
              <li className="flex gap-3">

                <Mail className="mt-1 h-4 w-4 shrink-0 text-accent" />

                <a
                  href={`mailto:${email}`}
                  className="transition hover:text-accent"
                >
                  {email}
                </a>

              </li>
            )}

          </ul>

        </div>

      </div>

      {/* COPYRIGHT */}

      <div className="border-t border-white/10">

        <div className="container-luxe flex flex-col items-center justify-between gap-3 py-6 text-[clamp(0.9rem,0.18vw+0.84rem,0.98rem)] text-primary-foreground/70 md:flex-row">

          <p className="text-white">
            © {new Date().getFullYear()}{" "}
            {companyName}. All Rights Reserved.
          </p>

          <p className="text-white">
            www.makranamarbleart.com • Crafted in India • Exporting Worldwide
          </p>

        </div>

      </div>

    </footer>
  );
}