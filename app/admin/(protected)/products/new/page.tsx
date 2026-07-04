import ProductForm from "@/components/ProductForm";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div className="admin_page">
      <h1 style={{ marginBottom: 28 }}>Add Product</h1>
      <ProductForm action={createProduct} />
    </div>
  );
}
