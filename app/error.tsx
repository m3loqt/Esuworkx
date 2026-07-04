"use client";

import ErrorState from "@/components/ErrorState";

export default function Error(_props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Something Went Wrong"
      message="An unexpected error occurred. Please try again or head back home."
    />
  );
}
