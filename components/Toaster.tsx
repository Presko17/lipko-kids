"use client";

import { useEffect, useState } from "react";

export function toast(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("toybox-toast", { detail: message }));
  }
}

export default function Toaster() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onToast = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      setShow(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShow(false), 1800);
    };
    window.addEventListener("toybox-toast", onToast);
    return () => {
      window.removeEventListener("toybox-toast", onToast);
      clearTimeout(timer);
    };
  }, []);

  return <div className={`toast${show ? " show" : ""}`}>{msg}</div>;
}
