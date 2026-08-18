"use client";

import { useState } from "react";
import { videoEmbedUrl } from "@/lib/video";

type Item = { type: "image" | "video"; src: string };

export default function ProductGallery({
  images,
  video,
  emoji,
  name,
  tintClass,
  badge,
}: {
  images: string[];
  video: string | null;
  emoji: string;
  name: string;
  tintClass: string;
  badge?: string | null;
}) {
  const items: Item[] = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...(video ? [{ type: "video" as const, src: video }] : []),
  ];
  const [active, setActive] = useState(0);
  const cur = items[active];

  const renderMedia = (it: Item) => {
    if (it.type === "image") return <img className="pimg" src={it.src} alt={name} />;
    const embed = videoEmbedUrl(it.src);
    if (embed) {
      return (
        <iframe
          className="pdp-video"
          src={embed}
          title={name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return <video className="pdp-video" src={it.src} controls playsInline />;
  };

  return (
    <div className="pdp-gallery">
      <div className={`pdp-media ${tintClass}`}>
        {badge && <span className="pdp-badge">{badge}</span>}
        {items.length === 0 ? <span className="pdp-emoji">{emoji}</span> : renderMedia(cur)}
      </div>

      {items.length > 1 && (
        <div className="pdp-thumbs">
          {items.map((it, i) => (
            <button
              key={i}
              type="button"
              className={`pdp-thumb ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={it.type === "video" ? "Видео" : `Снимка ${i + 1}`}
            >
              {it.type === "image" ? (
                <img src={it.src} alt="" />
              ) : (
                <span className="pdp-thumb-vid">▶</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
