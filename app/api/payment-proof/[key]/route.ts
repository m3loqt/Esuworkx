import { cookies } from "next/headers";
import { paymentProofStore } from "@/lib/blobs";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { safeImageContentType } from "@/lib/uploads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!(await verifySessionToken(token))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { key } = await params;
  const result = await paymentProofStore().getWithMetadata(key, {
    type: "arrayBuffer",
  });

  if (!result) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = safeImageContentType(result.metadata?.contentType);

  return new Response(result.data, {
    headers: { "Content-Type": contentType, "X-Content-Type-Options": "nosniff" },
  });
}
