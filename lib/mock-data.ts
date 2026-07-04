import type { Product, Work } from "@/db/schema";

// Seed data for `db/seed.ts` — shapes match the `products` and `works` tables.

export const mockWorks: Work[] = [
  {
    id: 1,
    title: "The Colossus",
    slug: "the-colossus",
    description:
      "A brutalist exploration of scale. Hand cast in industrial charcoal resin.",
    images: [
      "/photos/tree/BB402237.jpg",
      "/photos/tree/BB402255.jpg",
      "/photos/tree/BB402272.jpg",
    ],
    status: "available",
    createdAt: new Date("2026-01-01"),
  },
  {
    id: 2,
    title: "Anatomical Unit",
    slug: "anatomical-unit",
    description:
      "Experimental study of internal structures. Limited made to order finishes.",
    images: [
      "/photos/leaf/BB402322.jpg",
      "/photos/leaf/BB402326.jpg",
      "/photos/leaf/BB402327.jpg",
    ],
    status: "sold",
    createdAt: new Date("2026-01-01"),
  },
];

export const mockProducts: Product[] = [
  {
    id: 3,
    name: "The Original Resin",
    slug: "the-original-resin",
    description:
      "Studio Series 01. Hand poured 4 inch resin figure. Signed and serialized to order.",
    price: "7500.00",
    images: [
      "/photos/tree/BB402291.jpg",
      "/photos/tree/BB402299.jpg",
      "/photos/tree/BB402300.jpg",
    ],
    specifications: [
      { label: "Size", detail: "4 inch hand poured resin figure" },
      { label: "Finish", detail: "Matte, hand painted" },
      { label: "Edition", detail: "Signed and serialized to order" },
      { label: "Shipping", detail: "Ships in 5-7 business days" },
    ],
    status: "limited",
    stockCount: 4,
    createdAt: new Date("2026-01-02"),
  },
  {
    id: 4,
    name: "Anatomical Study Cast",
    slug: "anatomical-study-cast",
    description:
      "Studio Series 02. Matte finish anatomical cast, standard studio inventory.",
    price: "5200.00",
    images: [
      "/photos/leaf/BB402362.jpg",
      "/photos/leaf/BB402363.jpg",
      "/photos/leaf/BB402367.jpg",
    ],
    specifications: [
      { label: "Size", detail: "5 inch industrial resin cast" },
      { label: "Finish", detail: "Matte charcoal" },
      { label: "Availability", detail: "Standard studio inventory" },
    ],
    status: "available",
    stockCount: 10,
    createdAt: new Date("2026-01-03"),
  },
  {
    id: 5,
    name: "Monochrome Set",
    slug: "monochrome-set",
    description: "A retired charcoal finish run. Archived — mold retired.",
    price: "3800.00",
    images: ["/photos/tree/BB402301.jpg", "/photos/tree/BB402302.jpg"],
    specifications: [
      { label: "Set", detail: "Two-piece set" },
      { label: "Finish", detail: "Charcoal" },
      { label: "Availability", detail: "Mold retired - archived run" },
    ],
    status: "sold_out",
    stockCount: 0,
    createdAt: new Date("2026-01-04"),
  },
];
