"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { products, type ProductSpecification } from "@/db/schema";
import { productImageStore } from "@/lib/blobs";
import { slugify } from "@/lib/product";
import { isAllowedImageFile, sanitizeFileName } from "@/lib/uploads";

export type ProductFormState = { status: "idle" | "error"; message?: string };

async function uploadImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    if (!isAllowedImageFile(file)) continue;
    const key = `${Date.now()}-${sanitizeFileName(file.name)}`;
    await productImageStore().set(key, await file.arrayBuffer(), {
      metadata: { contentType: file.type },
    });
    urls.push(`/api/product-image/${encodeURIComponent(key)}`);
  }
  return urls;
}

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const root = base || "product";
  let slug = root;
  let suffix = 1;

  for (;;) {
    const existing = await db.select().from(products).where(eq(products.slug, slug));
    const conflict = existing.find((p) => p.id !== excludeId);
    if (!conflict) return slug;
    suffix += 1;
    slug = `${root}-${suffix}`;
  }
}

function parseSpecifications(raw: string): ProductSpecification[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(
      (s): s is ProductSpecification =>
        typeof s === "object" && s !== null && "label" in s && "detail" in s,
    )
    .map((s) => ({ label: String(s.label).trim(), detail: String(s.detail).trim() }))
    .filter((s) => s.label || s.detail);
}

function readProductFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: String(formData.get("price") ?? "0").trim() || "0",
    status: String(formData.get("status") ?? "available"),
    stockCount: Number(formData.get("stockCount") ?? 1),
    specifications: parseSpecifications(String(formData.get("specifications") ?? "")),
    imageFiles: formData
      .getAll("images")
      .filter((f): f is File => f instanceof File && f.size > 0),
  };
}

function revalidateStorefront(slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  if (slug) revalidatePath(`/shop/${slug}`);
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const { name, description, price, status, stockCount, specifications, imageFiles } =
    readProductFields(formData);

  if (!name) {
    return { status: "error", message: "Name is required." };
  }

  const slug = await uniqueSlug(slugify(name));
  const images = await uploadImages(imageFiles);

  await db.insert(products).values({
    name,
    slug,
    description: description || null,
    price,
    images,
    specifications,
    status,
    stockCount,
  });

  revalidateStorefront(slug);
  redirect("/admin/products");
}

export async function updateProduct(
  id: number,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const { name, description, price, status, stockCount, specifications, imageFiles } =
    readProductFields(formData);

  if (!name) {
    return { status: "error", message: "Name is required." };
  }

  const [existing] = await db.select().from(products).where(eq(products.id, id));
  if (!existing) {
    return { status: "error", message: "Product not found." };
  }

  const images = imageFiles.length > 0 ? await uploadImages(imageFiles) : existing.images;

  await db
    .update(products)
    .set({ name, description: description || null, price, images, specifications, status, stockCount })
    .where(eq(products.id, id));

  revalidateStorefront(existing.slug);
  redirect("/admin/products");
}

export async function deleteProduct(id: number, _formData: FormData): Promise<void> {
  let failed = false;
  try {
    await db.delete(products).where(eq(products.id, id));
  } catch {
    failed = true;
  }

  if (failed) {
    redirect(
      "/admin/products?error=" +
        encodeURIComponent("Can't delete a product that has existing orders."),
    );
  }

  revalidateStorefront();
  redirect("/admin/products");
}
