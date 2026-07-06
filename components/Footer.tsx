function InstagramIcon() {
  return (
    <svg
      className="footer_icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      className="footer_icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer>
      <div className="footer_links">
        <a href="https://instagram.com/esuworx" target="_blank" rel="noreferrer">
          <InstagramIcon />
          Instagram
        </a>
        <a href="mailto:collect@esuworx.shop">
          <EmailIcon />
          Email
        </a>
      </div>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: 0.5 }}>
        © 2026 ESUWORX. MADE IN THE PHILIPPINES.
      </p>
    </footer>
  );
}
