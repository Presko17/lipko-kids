"use client";

import { deleteProductAction } from "@/app/admin/actions";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!confirm(`Изтриване на „${name}“? Това действие е необратимо.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="admin-row-del" title="Изтрий продукта" aria-label={`Изтрий ${name}`}>
        🗑
      </button>
    </form>
  );
}
