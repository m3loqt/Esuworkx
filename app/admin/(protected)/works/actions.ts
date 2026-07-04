"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { works } from "@/db/schema";
import { productImageStore } from "@/lib/blobs";
import { slugify } from "@/lib/product";

export type WorkFormState = { status: "idle" | "error"; message?: string };

async function uploadImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const key = `${Date.now()}-${file.name}`;
    await productImageStore().set(key, await file.arrayBuffer(), {
      metadata: { contentType: file.type || "application/octet-stream" },
    });
    urls.push(`/api/product-image/${encodeURIComponent(key)}`);
  }
  return urls;
}

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const root = base || "work";
  let slug = root;
  let suffix = 1;

  for (;;) {
    const existing = await db.select().from(works).where(eq(works.slug, slug));
    const conflict = existing.find((w) => w.id !== excludeId);
    if (!conflict) return slug;
    suffix += 1;
    slug = `${root}-${suffix}`;
  }
}

function parseImageList(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function readWorkFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    status: String(formData.get("status") ?? "available"),
    keepImages: parseImageList(formData.get("keepImages")),
    imageFiles: formData
      .getAll("images")
      .filter((f): f is File => f instanceof File && f.size > 0),
  };
}

function revalidateStorefront() {
  revalidatePath("/admin/works");
  revalidatePath("/");
}

export async function createWork(
  _prevState: WorkFormState,
  formData: FormData,
): Promise<WorkFormState> {
  const { title, description, status, imageFiles } = readWorkFields(formData);

  if (!title) {
    return { status: "error", message: "Title is required." };
  }

  const slug = await uniqueSlug(slugify(title));
  const images = await uploadImages(imageFiles);

  await db.insert(works).values({
    title,
    slug,
    description: description || null,
    images,
    status,
  });

  revalidateStorefront();
  redirect("/admin/works");
}

export async function updateWork(
  id: number,
  _prevState: WorkFormState,
  formData: FormData,
): Promise<WorkFormState> {
  const { title, description, status, keepImages, imageFiles } = readWorkFields(formData);

  if (!title) {
    return { status: "error", message: "Title is required." };
  }

  const [existing] = await db.select().from(works).where(eq(works.id, id));
  if (!existing) {
    return { status: "error", message: "Work not found." };
  }

  const uploaded = await uploadImages(imageFiles);
  const images = [...keepImages, ...uploaded];

  await db
    .update(works)
    .set({ title, description: description || null, images, status })
    .where(eq(works.id, id));

  revalidateStorefront();
  redirect("/admin/works");
}

export async function deleteWork(id: number, _formData: FormData): Promise<void> {
  await db.delete(works).where(eq(works.id, id));
  revalidateStorefront();
  redirect("/admin/works");
}
