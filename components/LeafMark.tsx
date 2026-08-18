// Linden (Tilia) leaf — the Липко brand mark. Cordate (heart-based) silhouette
// with a central vein, side veins and a short stem.
export default function LeafMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`leaf-mark ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2.2 C14.5 5 20 8.5 19.6 14 C19.2 18.8 15 20.6 12.7 21.6 C12.45 21.1 12.2 20.4 12 19.8 C11.8 20.4 11.55 21.1 11.3 21.6 C9 20.6 4.8 18.8 4.4 14 C4 8.5 9.5 5 12 2.2 Z"
        fill="var(--leaf, #7ba35a)"
      />
      <path
        d="M12 20 L12 4.6"
        stroke="var(--leaf-vein, #4e7538)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M12 9.6 L7.8 7.6 M12 9.6 L16.2 7.6 M12 13.6 L8.5 12.2 M12 13.6 L15.5 12.2"
        stroke="var(--leaf-vein, #4e7538)"
        strokeWidth="1.05"
        strokeLinecap="round"
      />
      <path
        d="M12 20 L12 23"
        stroke="var(--leaf-vein, #4e7538)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
