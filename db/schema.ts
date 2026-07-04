import {
  pgTable,
  serial,
  text,
  numeric,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export type ProductSpecification = { label: string; detail: string };

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: numeric("price").notNull(),
  images: text("images").array(),
  specifications: jsonb("specifications").$type<ProductSpecification[]>(),
  status: text("status").notNull().default("available"), // available | limited | sold_out
  stockCount: integer("stock_count").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  buyerName: text("buyer_name").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  buyerPhone: text("buyer_phone").notNull(),
  buyerAddress: text("buyer_address").notNull(),
  proofOfPaymentUrl: text("proof_of_payment_url").notNull(),
  status: text("status").notNull().default("pending"), // pending | confirmed | rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price").notNull(),
});

// Portfolio pieces the studio has made — inquiry-only, not for direct sale.
// Fully separate from `products` (the shop's for-sale inventory).
export const works = pgTable("works", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  images: text("images").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type Work = typeof works.$inferSelect;
export type NewWork = typeof works.$inferInsert;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
