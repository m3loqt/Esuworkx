import AdminDrawer from "@/components/AdminDrawer";
import ProductForm from "@/components/ProductForm";
import { createProduct } from "../../actions";

export default function NewProductModal() {
  return (
    <AdminDrawer title="Add Product">
      <ProductForm action={createProduct} />
    </AdminDrawer>
  );
}
