import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AdminDrawer from "@/components/AdminDrawer";
import ProductForm from "@/components/ProductForm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { updateProduct } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditProductModal({
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
    <AdminDrawer title="Edit Product">
      <ProductForm action={updateProduct.bind(null, product.id)} product={product} />
    </AdminDrawer>
  );
}
