"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { price } from "@/lib/money";
import { Icon } from "./admin/icons";

type Suggestion = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number | null;
  image: string | null;
  emoji: string;
  soldOut: boolean;
};

// Header search field with live product suggestions. Picking a suggestion opens
// that product; Enter on the typed text submits the surrounding form, which
// goes to the full /search results.
export default function NavSearchPop({
  query,
  setQuery,
  onClose,
}: {
  query: string;
  setQuery: (q: string) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Suggestion[]>([]);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const term = query.trim();
  const reqId = useRef(0);

  useEffect(() => {
    setActive(-1);
    if (term.length < 2) {
      setItems([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    const id = ++reqId.current;
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d: { items: Suggestion[]; total: number }) => {
          if (id !== reqId.current) return;
          setItems(d.items);
          setTotal(d.total);
          setLoading(false);
        })
        .catch(() => {
          if (id === reqId.current) setLoading(false);
        });
    }, 140);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [term]);

  const open = term.length >= 2;
  const showAll = items.length > 0 && total > items.length;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") return onClose();
    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? items.length - 1 : a - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      router.push(`/product/${items[active].id}`);
      onClose();
    }
  };

  return (
    <div className="nav-search-pop">
      <Icon name="search" size={16} />
      <input
        autoFocus
        type="search"
        placeholder="Търси играчка…"
        aria-label="Търсене на играчки"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open && items.length > 0}
        aria-controls="nav-suggest"
        aria-activedescendant={active >= 0 ? `sug-${items[active].id}` : undefined}
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button type="submit">Търси</button>

      {open && (
        <div className="nav-suggest">
          {items.length > 0 ? (
            <ul id="nav-suggest" role="listbox" aria-label="Предложения">
              {items.map((s, i) => (
                <li key={s.id} id={`sug-${s.id}`} role="option" aria-selected={i === active}>
                  <Link
                    href={`/product/${s.id}`}
                    className={`sug${i === active ? " active" : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={onClose}
                    tabIndex={-1}
                  >
                    <span className="sug-img">
                      {s.image ? <img src={s.image} alt="" /> : <span>{s.emoji}</span>}
                    </span>
                    <span className="sug-text">
                      <b>{s.name}</b>
                      <small>{s.soldOut ? "Изчерпан" : s.category}</small>
                    </span>
                    <span className="sug-price">
                      {price(s.price)}
                      {s.oldPrice != null && s.oldPrice > s.price && <s>{price(s.oldPrice)}</s>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="sug-empty">{loading ? "Търсене…" : `Няма играчки за „${term}“.`}</p>
          )}
          {items.length > 0 && (
            <button type="submit" className="sug-all">
              {showAll ? `Виж всички ${total} резултата` : "Виж резултатите"} за „{term}“
              <Icon name="arrow" size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
