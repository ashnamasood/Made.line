"use server";

import { revalidatePath } from "next/cache";
import { isStatus, setOrderStatus } from "@/lib/orders";

/**
 * Called from the orders list's buttons. The action posts to an /admin URL,
 * so the proxy's session check guards it like the pages.
 */
export async function updateStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = formData.get("status");
  if (!Number.isInteger(id) || !isStatus(status)) return;
  await setOrderStatus(id, status);
  // The whole panel, so the dashboard's counts move too.
  revalidatePath("/admin", "layout");
}
