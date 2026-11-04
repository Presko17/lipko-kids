"use client";

import { useState } from "react";
import { useWishlist, flyHeart } from "@/lib/wishlist";
import { Icon } from "./admin/icons";

// Heart toggle used on product cards and the product page. Adding plays the
// heart burst + flight to the header's "Любими" button.
export default function WishButton({
  id,
  name,
  className,
  size = 18,
}: {
  id: string;
  name: string;
  className: string;
  size?: number;
}) {
  const { has, toggle } = useWishlist();
  const on = has(id);
  const [pop, setPop] = useState<"in" | "out" | null>(null);

  return (
    <button
      type="button"
      className={`${className} wish-btn${on ? " on" : ""}${pop ? ` pop-${pop}` : ""}`}
      aria-pressed={on}
      aria-label={on ? `Премахни ${name} от любими` : `Добави ${name} в любими`}
      title={on ? "Премахни от любими" : "Добави в любими"}
      onAnimationEnd={() => setPop(null)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggle(id);
        setPop(added ? "in" : "out");
        if (added) flyHeart(e.currentTarget);
      }}
    >
      <Icon name="heart" size={size} />
    </button>
  );
}
