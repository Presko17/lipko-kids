import { promises as fs } from "fs";
import path from "path";
import { put, del } from "@vercel/blob";

// Dual-mode file storage:
//  • Production (Vercel): uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set.
//  • Local dev: writes to public/uploads/ (served statically by Next).
// The returned string (a Blob https URL or a /uploads/… path) goes straight into
// an <img src>, so both work transparently on the storefront.

const rand = () => Math.random().toString(36).slice(2, 6);
const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

export async function saveFile(
  id: string,
  bytes: Buffer,
  ext: string,
  contentType?: string
): Promise<string> {
  const safeExt = (ext || "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const filename = `${id}-${Date.now()}-${rand()}.${safeExt}`;

  if (useBlob()) {
    const { url } = await put(`uploads/${filename}`, bytes, {
      access: "public",
      addRandomSuffix: false,
      contentType: contentType || undefined,
    });
    return url;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), bytes);
  return `/uploads/${filename}`;
}

export async function deleteFile(ref: string | null): Promise<void> {
  if (!ref) return;
  if (/^https?:\/\//.test(ref)) {
    try {
      await del(ref);
    } catch {
      /* already gone / not ours — ignore */
    }
  } else if (ref.startsWith("/uploads/")) {
    try {
      await fs.unlink(path.join(process.cwd(), "public", ref));
    } catch {
      /* already gone — ignore */
    }
  }
}
