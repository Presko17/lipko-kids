"use client";

import { useRouter } from "next/navigation";
import { useAccount } from "@/lib/wishlist";
import { Icon } from "./admin/icons";

export default function AccountLogout() {
  const router = useRouter();
  const { logout } = useAccount();
  return (
    <button
      type="button"
      className="acct-logout"
      onClick={async () => {
        await logout();
        router.replace("/account");
        router.refresh();
      }}
    >
      <Icon name="logout" size={16} /> Изход
    </button>
  );
}
