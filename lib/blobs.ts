import { getStore } from "@netlify/blobs";

export function paymentProofStore() {
  return getStore("payment-proofs");
}

export function productImageStore() {
  return getStore("product-images");
}
