import { productImageStore } from "@/lib/blobs";

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

  const contentType =
    (result.metadata?.contentType as string) || "application/octet-stream";

  return new Response(result.data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
