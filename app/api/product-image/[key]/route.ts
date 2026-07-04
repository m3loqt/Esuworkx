import { productImageStore } from "@/lib/blobs";
import { safeImageContentType } from "@/lib/uploads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const result = await productImageStore().getWithMetadata(key, {
    type: "arrayBuffer",
  });

  if (!result) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = safeImageContentType(result.metadata?.contentType);

  return new Response(result.data, {
    headers: {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
