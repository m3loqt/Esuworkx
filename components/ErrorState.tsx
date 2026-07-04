import Image from "next/image";
import Link from "next/link";

export default function ErrorState({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has moved.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        textAlign: "center",
      }}
    >
      <Image
        src="/ui/error.png"
        alt=""
        width={520}
        height={520}
        style={{ width: 440, maxWidth: "100%", height: "auto", marginBottom: 30 }}
        priority
      />
      <h1
        style={{
          fontSize: 24,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-0.5px",
          marginBottom: 10,
        }}
      >
        {title}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 30, maxWidth: 420 }}>
        {message}
      </p>
      <Link href="/" className="btn_main" style={{ maxWidth: 240 }}>
        GO BACK HOME
      </Link>
    </div>
  );
}
