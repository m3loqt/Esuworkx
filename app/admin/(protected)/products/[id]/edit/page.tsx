import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { updateProduct } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, Number(id)));

  if (!product) notFound();

  return (
    <div className="admin_page">
      <h1 style={{ marginBottom: 28 }}>Edit Product</h1>
      <ProductForm action={updateProduct.bind(null, product.id)} product={product} />
    </div>
  );
}
