import statuario from "@/assets/tex-statuario.jpg";
import marquina from "@/assets/tex-marquina.jpg";
import onyx from "@/assets/tex-onyx.jpg";
import travertine from "@/assets/tex-travertine.jpg";
import granite from "@/assets/tex-granite.jpg";

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export const categories: Category[] = [
  { id: "italian-marble", name: "Italian Marble", description: "Timeless Carrara, Statuario & Calacatta.", image: statuario },
  { id: "granite", name: "Granite", description: "Durable, polished granite in earth tones.", image: granite },
  { id: "onyx", name: "Onyx", description: "Backlit translucent luxury stone.", image: onyx },
  { id: "travertine", name: "Travertine", description: "Warm classical Roman stone.", image: travertine },
  { id: "quartz", name: "Quartz", description: "Engineered stone, ultra consistent.", image: statuario },
  { id: "sandstone", name: "Sandstone", description: "Natural exterior facades.", image: travertine },
  { id: "tiles", name: "Tiles", description: "Precision-cut marble tiles.", image: marquina },
  { id: "mosaic", name: "Mosaic", description: "Handcrafted mosaic patterns.", image: onyx },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  origin: string;
  finish: string;
  thickness: string;
  price?: string;
  image: string;
  description: string;
  featured?: boolean;
  isNew?: boolean;
  popular?: boolean;
};

export const products: Product[] = [
  { id: "statuario-classico", name: "Statuario Classico", category: "Italian Marble", origin: "Carrara, Italy", finish: "Polished", thickness: "18 mm", price: "On request", image: statuario, description: "The pinnacle of Italian marble — luminous white ground with elegant grey veining.", featured: true, isNew: true, popular: true },
  { id: "nero-marquina", name: "Nero Marquina", category: "Italian Marble", origin: "Basque, Spain", finish: "Honed", thickness: "20 mm", image: marquina, description: "Deep black stone with dramatic white veining, ideal for statement walls.", featured: true, popular: true },
  { id: "green-onyx", name: "Emerald Onyx", category: "Onyx", origin: "Pakistan", finish: "Polished", thickness: "18 mm", image: onyx, description: "Translucent green onyx, breathtaking when backlit.", featured: true, isNew: true },
  { id: "roman-travertine", name: "Roman Travertine", category: "Travertine", origin: "Tivoli, Italy", finish: "Filled & Honed", thickness: "20 mm", image: travertine, description: "Warm classical travertine used across the ages.", featured: true },
  { id: "absolute-black-granite", name: "Absolute Black Granite", category: "Granite", origin: "India", finish: "Polished", thickness: "18 mm", image: granite, description: "Uniform jet-black granite for kitchens and floors.", popular: true },
  { id: "calacatta-gold", name: "Calacatta Gold", category: "Italian Marble", origin: "Carrara, Italy", finish: "Polished", thickness: "20 mm", image: statuario, description: "White ground crossed by warm gold veins.", isNew: true, popular: true },
  { id: "silver-travertine", name: "Silver Travertine", category: "Travertine", origin: "Turkey", finish: "Vein Cut", thickness: "18 mm", image: travertine, description: "Cool silver-grey banding with a soft matte finish." },
  { id: "black-mosaic", name: "Marquina Mosaic", category: "Mosaic", origin: "Handcrafted", finish: "Polished", thickness: "10 mm", image: marquina, description: "Hand-set mosaic tiles from Nero Marquina offcuts." },
];

export const applications = [
  { name: "Kitchen", image: statuario },
  { name: "Flooring", image: travertine },
  { name: "Bathroom", image: marquina },
  { name: "Wall Cladding", image: onyx },
  { name: "Hotels", image: statuario },
  { name: "Commercial", image: granite },
];

export const testimonials = [
  { name: "Aditi Sharma", role: "Interior Designer, Mumbai", quote: "The Statuario slabs Aureo supplied for our penthouse project were flawless. Their craftsmanship is world-class.", rating: 5 },
  { name: "Marco Rossi", role: "Architect, Milan", quote: "Consistent quality across containers, on-time export, and a team that truly understands stone.", rating: 5 },
  { name: "Rahul Mehta", role: "Developer, Dubai", quote: "We now specify Aureo on every luxury tower. The finish is uncompromising.", rating: 5 },
];

export const brands = ["MERIDIAN", "AURUM", "CASA NOVA", "ATELIER", "MONOLITH", "ROSSO", "NORDEN", "VELLUM"];

export const posts = [
  { id: "choosing-marble-2026", title: "Choosing the right marble for your home in 2026", excerpt: "A designer's guide to selecting stone that ages beautifully.", date: "Mar 2026", image: statuario },
  { id: "care-and-sealing", title: "Marble care & sealing: a practical guide", excerpt: "Everyday rituals that protect your investment.", date: "Feb 2026", image: travertine },
  { id: "italy-quarry-tour", title: "Inside the Carrara quarries", excerpt: "A journey through the birthplace of Statuario.", date: "Jan 2026", image: marquina },
];
